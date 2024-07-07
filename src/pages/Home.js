import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import Topbar from "../components/topbar";
import "../styles/pages.style.css";
import Chart from "react-apexcharts";
import chatbot from "../assets/images/chatbot.png";
import details from "../assets/images/details.png";
import { Link } from "react-router-dom";

const Home = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Series 1",
        data: [10, 41, 35, 51, 49],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 150,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "80%",
          endingShape: "rounded",
        },
      },
      colors: ["#5C30F4"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May"],
      },
      yaxis: {
        show: false,
        title: {
          text: "Value",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    },
  });
  return (
    <>
      <div className="p-4">
        <Topbar />

        <div className="mt-5">
          <p className="home_title">Analytics</p>
          <Row>
            <Col md={9}>
              <Row>
                <Col md={3}>
                  <Card className="w-100 border-0 shadow">
                    <div className="bar-chart w-100">
                      <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="bar"
                        height={150}
                      />
                    </div>
                    <p className="text-center fs-6 fw-bold">Total Uploads</p>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="w-100 border-0 shadow">
                    <div className="bar-chart w-100">
                      <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="bar"
                        height={150}
                      />
                    </div>
                    <p className="text-center fs-6 fw-bold">
                      Scheduled Uploads
                    </p>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="w-100 border-0 shadow">
                    <div className="bar-chart w-100">
                      <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="bar"
                        height={150}
                      />
                    </div>
                    <p className="text-center fs-6 fw-bold">
                      Successful Uploads
                    </p>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="w-100 border-0 shadow">
                    <div className="bar-chart w-100">
                      <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="bar"
                        height={150}
                      />
                    </div>
                    <p className="text-center fs-6 fw-bold">
                      Unsuccessful Uploads
                    </p>
                  </Card>
                </Col>
              </Row>

              <div className="mt-3">
                <Card className="shadow border-0">
                  <CardHeader className="border-0 bg-white">
                    <CardTitle className="fs-5 fw-bold">
                      Create post content
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="d-flex justify-content-center mt-2">
                    <Link to={"/compose"}>
                      <Button className="post_create_btn">Generate</Button>
                    </Link>
                  </CardBody>
                </Card>
              </div>

              <Row className="mt-4">
                <Col md={9}>
                  <Card className="border-0 shadow p-2">
                    <div className="d-flex justify-content-between">
                      <p className="fs-4 fw-bold">Recent Content</p>
                      <p className="fw-bold">Rating</p>
                    </div>

                    <div>
                      <Row>
                        <Col md={2}>
                          <div>
                            <img src={details} alt="" />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div>
                            <p className="details_desc">
                              Captured in a moment of quiet grace, she sits on
                              the edge of a chair
                            </p>
                          </div>

                          <div></div>
                        </Col>
                        <Col md={4}>
                          <div className="text-end">+30%</div>
                        </Col>
                      </Row>

                      <Row className="mt-3">
                        <Col md={2}>
                          <div>
                            <img src={details} alt="" />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div>
                            <p className="details_desc">
                              Captured in a moment of quiet grace, she sits on
                              the edge of a chair
                            </p>
                          </div>

                          <div></div>
                        </Col>
                        <Col md={4}>
                          <div className="text-end">+30%</div>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="shadow border-0 bg-white">
                    <div className="d-flex justify-content-center mt-3">
                      <img src={chatbot} alt="" />
                    </div>
                    <div className="text-center">
                      <p className="fs-6 fw-bold">Chat with AI</p>
                      <p style={{ fontSize: "11px" }}>
                        Chat with Ai to get suggestions regarding content
                      </p>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col md={3}></Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Home;
