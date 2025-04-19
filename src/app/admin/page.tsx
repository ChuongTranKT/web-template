"use client"
import { Card, Col, Row, Statistic, Typography } from "antd"
import { UserOutlined, EyeOutlined } from "@ant-design/icons"
import React from "react"
import { Line } from "@ant-design/charts" // Dùng thư viện charts để vẽ biểu đồ

const { Title } = Typography

const AdminPage = () => {
  // Dữ liệu mẫu cho thống kê
  const visitsData = [
    { date: "2025-02-01", value: 120 },
    { date: "2025-02-02", value: 135 },
    { date: "2025-02-03", value: 150 },
    { date: "2025-02-04", value: 170 },
    { date: "2025-02-05", value: 180 },
    { date: "2025-02-06", value: 210 },
    { date: "2025-02-07", value: 220 },
  ]

  // Cấu hình biểu đồ thống kê truy cập
  const config = {
    data: visitsData,
    xField: "date",
    yField: "value",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  }

  return (
    <div className="p-6">
      <Title level={2}>Trang Quản Lý</Title>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Lượng Truy Cập"
              value={1024}
              prefix={<EyeOutlined />}
              suffix="Lượt"
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Lượng Người Liên Hệ"
              value={203}
              prefix={<UserOutlined />}
              suffix="Người"
            />
          </Card>
        </Col>
      </Row>

      <div className="mt-8">
        <Title level={3}>Biểu đồ Lượng Truy Cập</Title>
        <Line {...config} />
      </div>
    </div>
  )
}

export default AdminPage
