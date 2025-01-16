import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const TongQuan = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 2,
    totalOrders: 6,
    totalSales: 5930000,
    productsByCategory: [],
  });
  const [revenueData, setRevenueData] = useState([]);
  const [filteredRevenueData, setFilteredRevenueData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/dashboard`);
      if (response.data.success) {
        setDashboardData(response.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Lỗi khi lấy dữ liệu tổng quan.");
    }
  };

  const fetchRevenueData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/order/getRevenue`);
      if (response.data.success) {
        const formattedData = Object.entries(response.data.revenueData).map(([date, revenue]) => ({
          date,
          revenue,
        }));
        setRevenueData(formattedData);
        setFilteredRevenueData(formattedData); // Hiển thị tất cả doanh thu ban đầu
      } else {
        setRevenueData([]);
        setFilteredRevenueData([]);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      toast.error("Lỗi khi lấy dữ liệu doanh thu.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterRevenueData = () => {
    let filtered = revenueData;

    if (selectedMonth) {
      filtered = filtered.filter((data) => data.date.startsWith(selectedMonth));
    }

    if (startDate && endDate) {
      filtered = filtered.filter((data) => {
        const date = new Date(data.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }

    setFilteredRevenueData(filtered);
  };

  useEffect(() => {
    fetchDashboardData();
    fetchRevenueData();
  }, []);

  useEffect(() => {
    filterRevenueData();
  }, [selectedMonth, startDate, endDate, revenueData]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Tổng Quan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div 
          className="p-6 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow cursor-pointer"
          onClick={() => navigate('/users')}
        >
          <h3 className="text-lg font-semibold">Tổng số người dùng</h3>
          <p className="text-4xl font-extrabold">{dashboardData.totalUsers}</p>
        </div>
        <div 
          className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow cursor-pointer"
          onClick={() => navigate('/orders')}
        >
          <h3 className="text-lg font-semibold">Tổng số đơn hàng</h3>
          <p className="text-4xl font-extrabold">{dashboardData.totalOrders}</p>
        </div>
        <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow">
          <h3 className="text-lg font-semibold">Tổng số tiền đã bán</h3>
          <p className="text-4xl font-extrabold">
            {dashboardData.totalSales.toLocaleString('vi-VN')} VND
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-gray-700">Chọn tháng để lọc doanh thu:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-gray-700">Từ ngày:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700">Đến ngày:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold">Doanh thu theo ngày</h3>
          {isLoading ? (
            <p>Đang tải...</p>
          ) : filteredRevenueData.length === 0 ? (
            <p>Không có dữ liệu doanh thu.</p>
          ) : (
            <Bar
              data={{
                labels: filteredRevenueData.map((data) => data.date),
                datasets: [
                  {
                    label: 'Doanh thu (VND)',
                    data: filteredRevenueData.map((data) => data.revenue),
                    backgroundColor: '#4CAF50',
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) =>
                        `${tooltipItem.raw.toLocaleString('vi-VN')} VND`,
                    },
                  },
                },
              }}
            />
          )}
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold">Phân loại sản phẩm</h3>
          {dashboardData.productsByCategory.length === 0 ? (
            <p>Không có dữ liệu sản phẩm.</p>
          ) : (
            <Doughnut
              data={{
                labels: dashboardData.productsByCategory.map((category) => category._id),
                datasets: [
                  {
                    data: dashboardData.productsByCategory.map((category) => category.count),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                  },
                ],
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TongQuan;
