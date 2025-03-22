"use client";

import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  AlertCircle,
  Zap,
  Globe,
  LineChart,
  LogIn,
  LogOut,
} from "lucide-react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const FraudDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [fraudData, setFraudData] = useState(null);
  const [activeTab, setActiveTab] = useState("apps");
  const [loginError, setLoginError] = useState("");
  const [blockedEntities, setBlockedEntities] = useState([]);
  const router = useRouter();

  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, getToken } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) {
    router.push("/sign-in");
    return null;
  }
  useEffect(() => {
    if (user) {
      const fetchBlockedEntities = async () => {
        try {
          const token = await getToken({template: "Stealthmode"});
          const response = await fetch('http://localhost:5000/api/blocked-entities', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch blocked entities');
          }
          
          const data = await response.json();
          // Extract entity IDs from the response
          const blockedIds = data.map(entity => entity.entityId);
          setBlockedEntities(blockedIds);
        } catch (error) {
          console.error('Error fetching blocked entities:', error);
        }
      };
      
      fetchBlockedEntities();
    }
  }, [user, getToken]);

  useEffect(() => {
    const fetchMockData = async () => {
      try {
        const token = await getToken({ template: "Stealthmode" });
        const response = await fetch("http://localhost:5000/api/mock-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch mock data");
        const data = await response.json();
        setFraudData(data);
      } catch (error) {
        console.error("Error fetching mock data:", error);
      }
    };

    if (user) fetchMockData();
  }, [user, getToken]);

  // const handleBlock = async (entity) => {
  //   try {
  //     const token = await getToken({template: "Stealthmode"});
  //     console.log("Token: ", token);
  
  //     // Create a more complete payload with entity information
  //     const payload = {
  //       entityId: entity.app_name, // Use as unique identifier
  //       entityType: 'app',
  //       riskLevel: entity.risk_level,
  //       category: entity.category,
  //       developer: entity.developer,
  //       reportedOn: entity.reported_on
  //     };
  
  //     console.log("Sending payload:", payload);
  
  //     const response = await fetch('http://localhost:5000/api/block', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify(payload),
  //     });
  
  //     // Handle response
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error('Error response:', errorText);
  //       throw new Error(`Request failed with status ${response.status}: ${errorText}`);
  //     }
  
  //     const data = await response.json();
  //     console.log("Success response:", data);
      
  //     // Update UI to show this entity has been blocked
  //     setBlockedEntities([...blockedEntities, entity.app_name]);
      
  //   } catch (error) {
  //     console.error('Block operation failed:', error);
  //     setLoginError(error.message);
  //   }
  // };

  const handleBlock = async (entity, entityType) => {
    try {
      const token = await getToken({template: "Stealthmode"});
      
      // Create a payload based on entity type
      let payload;
      if (entityType === 'app') {
        payload = {
          entityId: entity.app_name,
          entityType: 'app',
          riskLevel: entity.risk_level,
          category: entity.category,
          developer: entity.developer,
          reportedOn: entity.reported_on
        };
      } else if (entityType === 'url') {
        payload = {
          entityId: entity.url,
          entityType: 'url',
          riskLevel: entity.risk_level,
          category: entity.category,
          detectedOn: entity.detected_on
        };
      }
      
      console.log("Sending payload:", payload);
  
      const response = await fetch('http://localhost:5000/api/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Success response:", data);
      
      // Update UI - use the appropriate ID field based on entity type
      const entityId = entityType === 'app' ? entity.app_name : entity.url;
      setBlockedEntities([...blockedEntities, entityId]);
      
    } catch (error) {
      console.error('Block operation failed:', error);
      setLoginError(error.message);
    }
  };
  


  // Improved login handler
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setLoginError('');

  //   try {
  //     const result = await signIn('credentials', {
  //       redirect: false,
  //       email,
  //       password,
  //     });

  //     if (result?.error) {
  //       throw new Error(result.error);
  //     }
  //   } catch (error) {
  //     setLoginError(error.message || 'Authentication failed');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Risk level badge color
  const getRiskLevelColor = (risk) => {
    const colorMap = {
      High: darkMode ? "bg-red-800 text-red-200" : "bg-red-100 text-red-800",
      Medium: darkMode
        ? "bg-orange-800 text-orange-200"
        : "bg-orange-100 text-orange-800",
      Low: darkMode
        ? "bg-green-800 text-green-200"
        : "bg-green-100 text-green-800",
    };
    return (
      colorMap[risk] ||
      (darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800")
    );
  };

  // Login screen
  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div
          className={`max-w-md w-full p-8 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <AlertCircle className="mr-2" size={24} />
              Fraud Detection Dashboard
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-opacity-80"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 rounded border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
                placeholder="admin@frauddashboard.com or analyst@frauddashboard.com"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2 rounded border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
                placeholder="Enter your password"
                required
                minLength="8"
              />
            </div>
            {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
            <button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              <LogIn className="mr-2" size={18} />
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Navigation */}
      <nav
        className={`px-4 py-3 flex justify-between items-center shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center">
          <AlertCircle className="mr-2" size={24} />
          <h1 className="text-xl font-bold">Fraud Detection Dashboard</h1>
        </div>
        <div className="flex items-center">
          {user && (
            <div className="mr-4">
              <span className="text-sm font-medium">
                {user.primaryEmailAddress?.emailAddress}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  darkMode
                    ? "bg-blue-800 text-blue-200"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {user.publicMetadata.role || "User"}
              </span>
            </div>
          )}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-opacity-80"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-opacity-80 flex items-center text-sm"
          >
            <LogOut size={20} className="mr-1" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mx-auto p-4">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center">
              <Zap
                className={`mr-3 ${
                  darkMode ? "text-yellow-300" : "text-yellow-500"
                }`}
                size={24}
              />
              <div>
                <h3 className="text-sm font-medium opacity-75">
                  Fraudulent Apps
                </h3>
                <p className="text-2xl font-bold">
                  {fraudData?.fraudulent_apps.length || 0}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`p-4 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center">
              <Globe
                className={`mr-3 ${
                  darkMode ? "text-blue-300" : "text-blue-500"
                }`}
                size={24}
              />
              <div>
                <h3 className="text-sm font-medium opacity-75">
                  Fraudulent URLs
                </h3>
                <p className="text-2xl font-bold">
                  {fraudData?.fraudulent_urls.length || 0}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`p-4 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center">
              <LineChart
                className={`mr-3 ${darkMode ? "text-red-300" : "text-red-500"}`}
                size={24}
              />
              <div>
                <h3 className="text-sm font-medium opacity-75">
                  Recent Fraud Trend
                </h3>
                <p className="text-2xl font-bold">
                  {fraudData?.fraud_trends_30_days[
                    fraudData.fraud_trends_30_days.length - 1
                  ]?.fraud_cases_detected || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div
          className={`p-4 rounded-lg shadow-md mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">
            Fraud Trend - Last 30 Days
          </h2>
          <div className="h-64">
            {fraudData?.fraud_trends_30_days && (
              <TrendChart
                data={fraudData.fraud_trends_30_days}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab("apps")}
            className={`py-2 px-4 font-medium ${
              activeTab === "apps"
                ? darkMode
                  ? "border-b-2 border-blue-500 text-blue-300"
                  : "border-b-2 border-blue-500 text-blue-700"
                : ""
            }`}
          >
            Fraudulent Apps
          </button>
          <button
            onClick={() => setActiveTab("urls")}
            className={`py-2 px-4 font-medium ${
              activeTab === "urls"
                ? darkMode
                  ? "border-b-2 border-blue-500 text-blue-300"
                  : "border-b-2 border-blue-500 text-blue-700"
                : ""
            }`}
          >
            Fraudulent URLs
          </button>
        </div>

        {/* App List */}
        {activeTab === "apps" && (
          <div
            className={`rounded-lg shadow-md overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    App Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Developer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Reported On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {fraudData?.fraudulent_apps.map((app, index) => (
                  <tr
                    key={index}
                    className={
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {app.app_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {app.developer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {app.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(
                          app.risk_level
                        )}`}
                      >
                        {app.risk_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {app.reported_on}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
  onClick={() => handleBlock(app, 'app')} // Pass the entire app object and entity type
  className={`text-sm px-3 py-1 rounded ${
    blockedEntities.includes(app.app_name)
      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
      : 'bg-red-100 text-red-800 hover:bg-red-200'
  }`}
  disabled={blockedEntities.includes(app.app_name)}
>
  {blockedEntities.includes(app.app_name) ? 'Blocked' : 'Block'}
</button>
                      <button className="text-blue-600 hover:text-blue-800 ml-2">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* URL List */}
        {activeTab === "urls" && (
          <div
            className={`rounded-lg shadow-md overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Detected On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {fraudData?.fraudulent_urls.map((url, index) => (
                  <tr
                    key={index}
                    className={
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {url.url}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {url.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(
                          url.risk_level
                        )}`}
                      >
                        {url.risk_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {url.detected_on}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
  onClick={() => handleBlock(url, 'url')} // Pass the entire url object and entity type
  className={`text-sm px-3 py-1 rounded ${
    blockedEntities.includes(url.url)
      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
      : 'bg-red-100 text-red-800 hover:bg-red-200'
  }`}
  disabled={blockedEntities.includes(url.url)}
>
  {blockedEntities.includes(url.url) ? 'Blocked' : 'Block'}
</button>
                      <button className="text-blue-600 hover:text-blue-800 ml-2">
                        Details 
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Line chart component for trend visualization
const TrendChart = ({ data, darkMode }) => {
  const chartData = data.map((item) => ({
    name: item.date.slice(5), // Format date to MM-DD
    value: item.fraud_cases_detected,
  }));

  // Calculate max value for Y axis
  const maxValue = Math.max(...data.map((item) => item.fraud_cases_detected));
  const yAxisMax = Math.ceil(maxValue / 10) * 10;

  // Chart dimensions
  const width = 1000;
  const height = 250;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };

  // Calculate scales
  // Update xScale calculation:
  const xScale = (i) =>
    padding.left +
    (i * (width - padding.left - padding.right)) / (chartData.length - 1 || 1); // Prevent division by zero
  const yScale = (value) =>
    height -
    padding.bottom -
    (value / yAxisMax) * (height - padding.top - padding.bottom);

  // Generate points for path
  const points = chartData
    .map((d, i) => `${xScale(i)},${yScale(d.value)}`)
    .join(" ");

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      {/* Y-axis */}
      <line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={height - padding.bottom}
        stroke={darkMode ? "#6B7280" : "#D1D5DB"}
        strokeWidth="1"
      />

      {/* X-axis */}
      <line
        x1={padding.left}
        y1={height - padding.bottom}
        x2={width - padding.right}
        y2={height - padding.bottom}
        stroke={darkMode ? "#6B7280" : "#D1D5DB"}
        strokeWidth="1"
      />

      {/* Y-axis ticks */}
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
        const y = yScale(tick * yAxisMax);
        return (
          <g key={tick}>
            <line
              x1={padding.left - 5}
              y1={y}
              x2={padding.left}
              y2={y}
              stroke={darkMode ? "#6B7280" : "#D1D5DB"}
              strokeWidth="1"
            />
            <text
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill={darkMode ? "#D1D5DB" : "#6B7280"}
            >
              {Math.round(tick * yAxisMax)}
            </text>
          </g>
        );
      })}

      {/* X-axis labels (every 5th data point) */}
      {chartData
        .filter((_, i) => i % 5 === 0)
        .map((d, i) => {
          const x = xScale(i * 5);
          return (
            <text
              key={i}
              x={x}
              y={height - padding.bottom + 15}
              textAnchor="middle"
              fontSize="10"
              fill={darkMode ? "#D1D5DB" : "#6B7280"}
            >
              {d.name}
            </text>
          );
        })}

      {/* Area under the curve */}
      <path
        d={`M${padding.left},${height - padding.bottom} ${chartData
          .map((d, i) => `L${xScale(i)},${yScale(d.value)}`)
          .join(" ")} L${width - padding.right},${height - padding.bottom} Z`}
        fill={darkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)"}
      />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={darkMode ? "#3B82F6" : "#2563EB"}
        strokeWidth="2"
      />

      {/* Data points */}
      {chartData.map((d, i) => (
        <circle
          key={i}
          cx={xScale(i)}
          cy={yScale(d.value)}
          r="4"
          fill={darkMode ? "#3B82F6" : "#2563EB"}
        />
      ))}
    </svg>
  );
};

export default FraudDashboard;
