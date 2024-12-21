import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from 'react-router-dom';
import productApi from "../../apis/product.api";
import { Popconfirm } from "antd";
import ProductForm from "../ProductManagement/components/ProductForm";
import Loading from "../../components/Loading";
import { formatCurrency, formatTime } from "../../utils/utils";
export default function ProductDetail() {

  const { id } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);

  console.log('Product ID:', id);

  const { data: product = {}, isLoading } =
    useQuery({
      queryKey: ["product", id],
      queryFn: () => productApi.getProductDetail(id),
      keepPreviousData: true,
      select: (result) => result?.data?.data
    });

  console.log(product);


  const showProductModal = (product) => {
    setModalOpen(true);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };
  const handleUpdateOk = () => {
    
  };

  

  const confirmDelete = (e) => {
    console.log(e);
  };
  const cancelDelete = (e) => {
    console.log(e);
  };
  return <>
    {isLoading && <Loading />}
    {product ? <div className="ml-3 bg-white w-full rounded-md">
      <div className="flex flex-col md:flex-row border-b border-background">
        <div className="w-full md:w-2/5 p-5  md:border-r border-background">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div className="flex-grow flex flex-col p-5 justify-center">
          <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
          <div className="mt-5 text-gray-600">
            <span className="font-semibold">Danh mục:</span> {product.category ? product.category.name : 'Không có thông tin'}
          </div>
          <div className="mt-5 text-gray-600">
            <span className="font-semibold">Xuất xứ:</span> {product.origin}
          </div>
          <div className="flex items-center gap-2 mt-5">
            <span className="font-semibold">Giá:</span>
            <span className="text-xl font-semibold text-secondary">{formatCurrency(product.price)}</span>
          </div>
          {product.discountPercentage > 0 &&
            (
              <>
                <div>
                  <div className="mt-4">
                    <span className="font-semibold">Giảm giá: </span>
                    <span className="text-xl font-semibold text-primary">{product.discountPercentage} %</span>
                  </div>
                  <div className="mt-4">
                    <span className="font-semibold">Thời gian hết hạn giảm giá: </span>
                    <span className="text-xl font-semibold text-secondary"> {formatTime(product.discountExpired)}</span>
                  </div>
                </div>
                <div className="mt-4">
                <span className="font-semibold">Giá sau khi giảm: </span>
                  <span className="text-lg   text-primary">
                    {product.price * (1 - product.discountPercentage / 100)} VND
                  </span>

                </div>
              </>
            )}


          <div className="mt-5 text-gray-600">
            <span className="font-semibold">Số lượng còn lại:</span> {product.quantity}
          </div>
          <div className="mt-5 text-gray-600">
            <span className="font-semibold">Đơn vị tính: </span> KG
          </div>

          <div className="flex items-center mt-5 gap-4">
            <button onClick={showProductModal} className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark">
              Chỉnh sửa
            </button>
            <Popconfirm
              title=""
              description="Bạn có chắc muốn xóa sản phẩm này"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              }
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
              okText="Xóa"
              cancelText="Hủy"
            >
              <button className="border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-100">
                Xóa
              </button>
            </Popconfirm>

          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thông tin chi tiết sản phẩm</h2>
          <p className="text-gray-600">{product.description}</p>
        </div>
        <div className="mt-4 text-gray-600">
          <span className="font-semibold">Xuất xứ:</span> {product.origin ? product.origin : 'Không có thông tin'}
        </div>
      </div>
    </div> :
      (<Loading />)
    }
    <ProductForm open={isModalOpen} product={product} onSubmit={handleUpdateOk} onClose={handleModalCancel} />
  </>
}