import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  FormGroup,
  Tooltip,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import "../styles/pages.style.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import btnCap from "../assets/icons/capBtn.png";
import moment from "moment";
import TimePicker from "react-time-picker";
import postPic from "../assets/icons/post.png";
import upload from "../assets/images/upload.png";
import postImage from "../assets/images/postPic.png";
import logo from "../assets/icons/poster.png";
import post_icon from "../assets/icons/post_icon.png";
import schedule from "../assets/icons/schedule.png";
import { FaSun, FaMoon } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { PiShareFat, PiVideo, PiPlusLight } from "react-icons/pi";
import { AiOutlineLike } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { HiDotsVertical } from "react-icons/hi";
import { FaRegComment, FaWhatsapp } from "react-icons/fa";
import { BsEmojiSmile, BsFilterLeft, BsThreeDots } from "react-icons/bs";
import { TiCameraOutline } from "react-icons/ti";
import { FaPlus } from "react-icons/fa6";
import { createPost, generateCaption, getPosts } from "../apis/post";
import DatePicker from "react-datepicker";
import "react-time-picker/dist/TimePicker.css";
import { useNavigate } from "react-router-dom";
// import Chip from '@mui/material/Chip';
// import Stack from '@mui/material/Stack';
import { Stack, Chip, TextField, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


const localizer = momentLocalizer(moment);

const populateHashTags = (hashtags) => {
  if (!hashtags) return "";
  if (!hashtags?.length) return "";
  return hashtags
    .map((hashtag) => {
      if (hashtag[0] !== "#") return `#${hashtag}`;
      return hashtag;
    })
    .join(",");
};

const initiatePost = (data) => ({
  title: data?.title || "",
  desc: data?.desc || "",
  hashtags: populateHashTags(data?.hashtags) || "#ABC",
});

const saveButtonCanBeEnabled = (post) => {
  return ["desc", "title", "hashtags"].every((key) => post[key]);
};

const Compose = ({ direction, ...args }) => {
  const dispatch = useDispatch();
  const { currentPost, loading, posts } = useSelector((state) => state.posts);
  const { currentUser } = useSelector((state) => state.authorization);
  const [modal, setModal] = useState(false);
  const [mediaModal, setMediaModal] = useState(false);
  const [post, setPost] = useState(initiatePost(currentPost));
  const [error, setError] = useState({});
  const [imageSrc, setImageSrc] = useState([]);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [switchBtn, setSwitchBtn] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [latestDraftedPost, setLatestDraftedPost] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);


  useEffect(() => {
    const func = async () => {
      const { payload } = await dispatch(getPosts({ status: "draft" }));
      console.log("payload:", payload);
      if (payload.success && payload.data?.length) {
        setLatestDraftedPost(payload.data?.[0]);
      }
    }
    func();
  }, [])



  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setFiles(event.target.files);
    const files = Array.from(event.target.files);
    const newImageSrcs = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImageSrcs.push({ src: e.target.result, type: file.type });
        if (newImageSrcs.length === files.length) {
          setImageSrc((prevMediaSrcs) => [...prevMediaSrcs, ...newImageSrcs]);
        }
      };
      reader.readAsDataURL(file);
    });

    toggleMedia(); // Toggle the modal after file upload
    // console.log("uploaded data", imageSrc);
  };

  const removeFile = (index) => {
    setImageSrc((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const setValue = (key, value) => {
    setPost({ ...post, [key]: value });
  };

  const onChange = ({ target: { name, value } }) => setValue(name, value);

  const getAiCaption = async () => {
    if (!post.title) {
      return setError({ title: "Title is required" });
    }
    const params = { topic: post.title };
    if (post.title) params.title = post.title;
    if (post.desc) params.desc = post.desc;
    const response = await dispatch(generateCaption(params));
    setPost(initiatePost(response.payload?.data));
  };

  const toggle = () => setModal(!modal);

  const [modalOpen, setModalOpen] = useState(false);
  const [importMediaModal, setImportMediaModal] = useState(false)

  const toggleModal = () => setModalOpen(!modalOpen);

  const toggleMedia = () => setMediaModal(!mediaModal);

  const toggleImportMedia = () => setImportMediaModal(!importMediaModal)

  const toggleDropDown = () => setDropdownOpen((prevState) => !prevState);

  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
  };

  const handleTime = () => {
    console.log("Selected Date:", selectedDay, "Time:", selectedTime);
    let [Hours, minutes] = selectedTime.split(":").map((x) => parseInt(x));

    selectedDay.setHours(Hours);
    selectedDay.setMinutes(minutes);
    selectedDay.setSeconds(0);

    postUpload({
      title: post.title,
      desc: post.desc,
      hashtags: post.hashtags,
      platforms: ["facebook"],
      status: "scheduled",
      files: files,
      scheduled_at: selectedDay,
    });
  };

  const handleTimeChange = (type, value) => {
    if (type === "start") {
      setStartTime(value);
    } else {
      setEndTime(value);
    }
  };

  const postUpload = async (postObject) => {
    const hashtags = postObject.hashtags.split(",").map((x) => x.trim());
    const formData = new FormData();
    formData.append("title", postObject.title);
    formData.append("desc", postObject.desc);
    formData.append("hashtags", JSON.stringify(hashtags));
    formData.append("user_id", currentUser?.id);
    formData.append("status", postObject.status);
    formData.append("platforms", JSON.stringify(postObject.platforms));
    if (postObject.scheduled_at) {
      formData.append("scheduled_at", postObject.scheduled_at);
    }

    for (let i = 0; i < files.length; i++) {
      formData.append("media", postObject.files[i]);
    }

    const resp = await dispatch(createPost(formData));
    if (resp.payload.success) {
      if (postObject.status === "draft") {
        setPost({ desc: "", title: "", hashtags: "" });
        setFiles([]);
        setImageSrc([]);
      }
    }
  };

  const handleSwitch = () => {
    setSwitchBtn(!switchBtn);
  };

  const toggleTooltip = () => {
    setTooltipOpen(!tooltipOpen);
  };



  const handleImportMedia = () => {

  }

  return (
    <>
      <div className="overflow-x-hidden">
        <Row>
          <Col md={9} className="p-5">
            <Card className="border-0 shadow">
              <div style={{ height: "100%" }}>
                <Calendar
                  localizer={localizer}
                  events={[]}
                  startAccessor="start"
                  endAccessor="end"
                  selectable
                  onSelectSlot={handleSelectSlot}
                  style={{ height: "400px" }}
                />
                {selectedDate && (
                  <div>
                    <h3>
                      Selected Date:{" "}
                      {moment(selectedDate).format("MMMM Do YYYY")}
                    </h3>
                    <div>
                      <label>Start Time: </label>
                      <TimePicker
                        onChange={(value) => handleTimeChange("start", value)}
                        value={startTime}
                      />
                    </div>
                    <div>
                      <label>End Time: </label>
                      <TimePicker
                        onChange={(value) => handleTimeChange("end", value)}
                        value={endTime}
                      />
                    </div>
                    <div>
                      <p>
                        Selected Time Slot: {startTime} - {endTime}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <div className="mt-4 mb-4">
              <BsFilterLeft className="fs-2" />
            </div>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status"></div>
              </div>
            ) : (
              <Card className="mt-3 shadow border-0 p-3">
                <div className="d-flex justify-content-between">
                  <div className="d-flex">
                    <div className="bg_icon_wrapper">
                      <img src={postPic} alt="" className="post_icon" />
                    </div>

                    <div>
                      <p className="ms-3">
                        {" "}
                        <span className="fs-5 fw-bold">
                          Create Post Content
                        </span>{" "}
                        <br /> Create a high performing post
                      </p>
                    </div>
                  </div>

                  {/* <div className="d-flex" onClick={getAiCaption}>
                    <img src={btnCap} alt="" className="cap_icon" />
                    <p className="fs-4 fw-bold cap_btn">AI</p>
                    <div>
                      <FormGroup switch>
                        <Input type="switch" checked={switchBtn} />
                      </FormGroup>
                      <div>
                        <p>Let Ai write for you.</p>
                      </div>
                    </div>
                      
                  </div> */}

                  {/* {
                    switchBtn ? (
                      <>
                        <div className="d-flex flex-column justify-content-end">
                          <div className="d-flex justify-content-end">
                            <div className="d-flex" onClick={getAiCaption} id="Heading">
                              <img src={btnCap} alt="" className="cap_icon" />
                              <p className="fs-4 fw-bold cap_btn">AI</p>
                            </div>

                            <Tooltip {...args}
                              isOpen={tooltipOpen}
                              target="Heading"
                              toggle={toggleTooltip}
                              placement="top"
                            >Let Ai write for you.</Tooltip>
                            <div>
                              <FormGroup switch className="mt-1 ms-2">
                                <Input type="switch" checked={switchBtn} onClick={handleSwitch} style={{ cursor: "pointer" }} />
                              </FormGroup>

                            </div>
                          </div>

                        </div>
                      </>
                    ) : (
                      <>
                        <div className="d-flex justify-content-end">
                          
                          <div>
                            <FormGroup switch className="mt-1 ms-2" id="enableAi">
                              <Input type="switch" checked={switchBtn} onClick={handleSwitch} style={{ cursor: "pointer" }} />
                            </FormGroup>
                            <Tooltip
                              {...args}
                              isOpen={tooltipOpen}
                              target="enableAi"
                              toggle={toggleTooltip}
                              placement="bottom"
                            >Enable Ai write for you.</Tooltip>
                          </div>
                        </div>
                      </>
                    )
                  } */}
                  <div className="d-flex flex-column justify-content-end">
                    <div className="d-flex justify-content-end">
                      <div className="d-flex" id="Heading">
                        <img src={btnCap} alt="" className="cap_icon" />
                        <p className="fs-4 fw-bold cap_btn">AI</p>
                      </div>

                      <Tooltip
                        {...args}
                        isOpen={tooltipOpen}
                        target="Heading"
                        toggle={toggleTooltip}
                        placement="top"
                      >

                      </Tooltip>
                    </div>
                  </div>
                </div>

                <div class="text-area-container">
                  <div className="upload_btn text-center" onClick={toggleMedia}>
                    <p className="fs-2">+</p>
                    <span>Upload your media here</span>
                  </div>

                  <div className="mb-3">
                    <div className="mt-2 d-flex flex-wrap">
                      {imageSrc.map((media, index) => (
                        <div
                          key={index}
                          className="position-relative uploaded-media-container"
                        >
                          {media.type.startsWith("image/") ? (
                            <img
                              src={media.src}
                              alt={`Uploaded ${index}`}
                              className="uploaded-img"
                            />
                          ) : (
                            <video controls className="uploaded-img">
                              <source src={media.src} type={media.type} />
                              Your browser does not support the video tag.
                            </video>
                          )}
                          <button
                            className="remove-btn"
                            onClick={() => removeFile(index)}
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="mb-3">
                    <Input
                      type="text"
                      name="title"
                      onChange={onChange}
                      value={post.title}
                      placeholder="Title"
                      className="post_fields"
                    />
                    {titleError && <p className="error mt-1">{titleError}</p>}
                  </div>

                  <textarea
                    id="postContent"
                    placeholder="Postor Ai generating description for you...."
                    name="desc"
                    onChange={onChange}
                    value={post.desc}
                    className="post_fields"
                  ></textarea>

                  <div className="mb-3">
                    <div className="mt-3 d-flex">
                      <div className="bg_icon_wrapper">
                        <p className="fs-4 mt-3">#</p>
                      </div>
                      <div className="mt-2 ms-3 fs-4 fw-bold">Hashtags</div>
                    </div>

                    <div className="hashtags_bg mt-3 p-2">
                      {post.hashtags ? (
                        <>
                          {post.hashtags.split(",").map((hashtag, index) => {
                            return (
                              <>
                                <div className="hashtags_pin me-2 p-2" key={index}>
                                  <p className="mt-3">{hashtag}</p>
                                </div>
                              </>
                            )
                          })}
                        </>
                      ) : (
                        ""
                      )}

                    </div>





                    {/* <Input
                      type="text"
                      name="hashtags"
                      onChange={onChange}
                      value={post.hashtags}
                      placeholder="Tags"
                      className="post_fields mt-2"
                    /> */}
                  </div>
                </div>

                <Modal
                  isOpen={importMediaModal}
                  toggle={toggleImportMedia}
                  {...args}
                  centered={true}
                  size="xl"
                  className="border-0"
                >

                  <Row>
                    <div className="d-flex justify-content-between p-4">
                      <p className="fs-3 fw-bold">Media Library</p>
                      <Input type="text" placeholder="search" className="media_search" />
                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropDown} direction={direction} >
                        <DropdownToggle caret>All</DropdownToggle>
                        <DropdownMenu {...args}>
                          <DropdownItem header>All</DropdownItem>
                          
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </Row>

                  <Row className="p-4">
                    <Col md={5} >
                      <img src={upload} alt="" className="media_data mt-2" />
                      <img src={upload} alt="" className="media_data mt-2" />
                      <img src={upload} alt="" className="media_data mt-2" />

                    </Col>
                    <Col md={2}>
                      <img src={upload} alt="" className="media_data mt-2" />
                      <img src={upload} alt="" className="media_data mt-2" />
                      <img src={upload} alt="" className="media_data mt-2" />
                    </Col>
                    <Col md={5}>
                      <img src={upload} alt="" className="media_data mt-2" />
                      <img src={upload} alt="" className="media_data mt-2" />
                      <img src={upload} alt="" className="media_data mt-2" />
                    </Col>

                  </Row>
                </Modal>

                <Modal
                  isOpen={mediaModal}
                  toggle={toggleMedia}
                  {...args}
                  centered={true}
                >
                  <div>
                    <Row className="p-4">
                      <Col md={6} className="d-flex justify-content-center">
                        <div className="upload_btns_bg" onClick={toggleImportMedia}>
                          <PiVideo className="fs-4 mb-2" />
                          <div>
                            <p className="text-center">
                              Import from <br /> media library
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col md={6} className="d-flex justify-content-center">
                        <div
                          className="upload_btns_bg"
                          onClick={handleIconClick}
                        >
                          <PiPlusLight className="fs-4 mb-2" />
                          <div>
                            <p className="text-center">
                              Upload media <br /> from device
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Modal>

                {/* <div className="d-flex justify-content-between">
                  <div className="d-flex">
                    <HiDotsVertical className="fs-4" />
                    <BsEmojiSmile className="fs-4 ms-1" />
                    <TiCameraOutline className="fs-3 ms-2" onClick={handleIconClick} style={{ cursor: "pointer" }} />
                  </div>

                  <div>
                    <FaPlus className="fs-5" />
                  </div>
                </div> */}

                <div className="mt-4 d-flex justify-content-center align-items-center">
                  {post.title && (
                    <Button
                      outline={true}
                      onClick={() =>
                        postUpload({
                          title: post.title,
                          desc: post.desc,
                          hashtags: post.hashtags,
                          platforms: ["facebook"],
                          status: "draft",
                          files: files,
                          scheduled_at: selectedDay,
                        })
                      }
                      className="me-3"
                    >
                      Save as Draft
                    </Button>
                  )}
                  <Button
                    outline={true}
                    onClick={saveButtonCanBeEnabled(post) ? toggle : () => null}
                    className="me-3"
                    disabled={!saveButtonCanBeEnabled(post)}
                  >
                    Save
                  </Button>
                  <Button className="post_btn" onClick={getAiCaption}>
                    Generate
                  </Button>
                </div>


                {/* post modal */}
                <Modal
                  isOpen={modal}
                  toggle={toggle}
                  {...args}
                  centered={true}
                  size="lg"
                >
                  <Row className="p-3">
                    <Col md={4}>
                      <div className="post_wrapper">
                        <img
                          src={imageSrc[0]?.src || postImage}
                          alt=""
                          className="upload_post"
                        />
                      </div>
                    </Col>
                    <Col md={8}>
                      <div className="content_div">
                        <div>
                          <p>{post.desc}</p>
                        </div>
                        <div>
                          <p className="mt-5">{post.hashtags}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="p-4 d-flex justify-content-between">
                    <Button className="Schedule_btn" onClick={toggleModal}>Schedule</Button>
                    <Button
                      className="post_btn_modal"
                      onClick={() =>
                        postUpload({
                          title: post.title,
                          desc: post.desc,
                          hashtags: post.hashtags,
                          platforms: ["facebook"],
                          status: "active",
                          files: files,
                        })
                      }
                    >
                      Post
                    </Button>
                  </div>
                </Modal>
              </Card>
            )}
          </Col>
          <Col md={3}>
            <div className="left_sidebar">
              <div className="heading_card">
                <p className="preview_heading">Preview</p>
              </div>

              <div className="p-2">
                {latestDraftedPost?.id && (
                  <Card className="p-2 border-0 shadow mb-3">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex">
                        <div className="post_logo">
                          <img src={logo} alt="" />
                        </div>

                        <div>
                          <p className="post_title">
                            {latestDraftedPost?.title} <br />{" "}
                            <span className="post_time">1h</span>
                          </p>
                        </div>
                      </div>

                      <div>
                        {/* <BsThreeDots className="fs-4 me-2" /> */}
                        <IoClose className="fs-3" />
                      </div>
                    </div>

                    <div>
                      <p className="post_desc">{latestDraftedPost.desc}</p>
                    </div>
                    {(() => {
                      const imageUrl = latestDraftedPost?.media?.[0]?.media_url;
                      return (
                        imageUrl && (
                          <div>
                            <img src={imageUrl} alt="" />
                            <hr />
                          </div>
                        )
                      );
                    })()}

                    <div className="d-flex justify-content-between">
                      <Button className="continue_btn">Continue</Button>
                    </div>
                  </Card>
                )}
              </div>

              <div>

                {/* DAte picker */}

                <Modal
                  isOpen={modalOpen}
                  toggle={toggleModal}
                  className="custom-modal"
                  size="sm"
                >
                  <div className="date-picker-container d-flex justify-content-center flex-column ">
                    <DatePicker
                      selected={selectedDay}
                      dateFormat="MMMM d, yyyy"
                      onChange={(date) => setSelectedDay(date)}
                      inline
                    />
                    <div className="time-picker">
                      <h3>Best Hours To Post</h3>
                      <TimePicker
                        onChange={setSelectedTime}
                        value={selectedTime}
                        disableClock
                        clearIcon={null}
                      />
                    </div>
                    <div className="d-flex justify-content-center">
                      <button className="date_btn" onClick={handleTime}>
                        Set Time
                      </button>
                      <button className="date_btn" onClick={toggleModal}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Compose;