import { useState } from "react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [isReportsOpen, setReportsOpen] = useState(false);

  const menuItems = [
    {
      id: "orders",
      label: "Đơn hàng",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7z" />
        </svg>
      ),
    },
    {
      id: "products",
      label: "Sản phẩm",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4l16-.02V7z" />
        </svg>
      ),
    },
    {
      id: "discounts",
      label: "Giảm giá",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "reports",
      label: "Báo cáo",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM9.75 17.25a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75Zm2.25-3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-5.25Z"
            clipRule="evenodd"
          />
          <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
        </svg>
      ),
      children: [
        { id: "monthly-revenue", label: "Báo cáo doanh thu theo tháng" },
        { id: "product-sales", label: "Báo cáo số lượng sản phẩm bán được" },
      ],
    },
  ];

  return (
    <div
      className={`h-screen sticky top-0 bg-white text-gray transition-all duration-300 ${
        isCollapsed ? "w-32" : "w-64"
      }`}
    >
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-gray-700 p-2 rounded hover:bg-gray-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      <nav className="p-2">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setReportsOpen(!isReportsOpen)}
                    className={`flex items-center justify-between w-full py-2 px-4 rounded transition-all ${
                      activeTab === item.id
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="material-icons">{item.icon}</span>
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {/* {!isCollapsed && (
                      <span className="material-icons">
                        {isReportsOpen ? "expand_less" : "expand_more"}
                      </span>
                    )} */}
                  </button>
                  {/* Hiển thị menu con */}
                  {isReportsOpen && !isCollapsed && (
                    <ul className="ml-4 space-y-2">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <button
                            onClick={() => setActiveTab(child.id)}
                            className={`block w-full text-left py-2 px-4 rounded ${
                              activeTab === child.id
                                ? "bg-gray-700"
                                : "hover:bg-gray-700"
                            }`}
                          >
                            {child.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 py-2 px-4 w-full rounded ${
                    activeTab === item.id ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  <span className="material-icons">{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
