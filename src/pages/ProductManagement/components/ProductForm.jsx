import { useState, useEffect, useContext } from "react";
import { Modal, Result } from "antd";
import Input from "../../../components/Input"
import Button from "../../../components/Button";
import PropTypes from "prop-types";
import { useMutation, useQuery } from "@tanstack/react-query";

import { toast } from "react-toastify";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchemas } from "../../../validations/ValidationSchemas"
import { useForm } from "react-hook-form";
import categoryAPi from "../../../apis/category.api";

const schema = yup.object({
  firstName: validationSchemas.firstName,
  lastName: validationSchemas.lastName,
  birthDay: validationSchemas.date,
})


export const ProductForm = ({
  open,
  onSubmit,
  onClose,
  product,
}) => {
  const { register,
    handleSubmit,
    control,
    formState: { errors }, reset } = useForm({ resolver: yupResolver(schema) });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [imagePreview, setImagePreview] = useState(product?.image);

  useEffect(() => {
    setImagePreview(product?.image || null);
  }, [product]);

  useEffect(() => {
    if (open) {
      setLoadingCategories(true);
      categoryAPi
        .getAllCategory()
        .then((response) => {
          setCategories(response?.data?.data || []);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        })
        .finally(() => {
          setLoadingCategories(false);
        });
    }
  }, [open]);

  console.log(categories);
  const handleImageChange = (e) => {

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.warn("File được chọn không phải là ảnh!");
    }
    else {
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
    }
  };
  console.log(product);
  const handleFormSubmit = () => {

  }

  const handleCancel = () => {
    reset();
    onClose();
  }

  return <>
    <Modal
      className=""
      open={open}
      width={2000}
      title=  <div className="justify-center flex py-4">{product ? "Sửa thông tin sản phẩm" : "Thêm sản phẩm"}</div>
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button key="submit" onClick={handleSubmit(handleFormSubmit)} className="bg-primary rounded-full text-white h-8 px-10 py-1 mr-10" >
          Xác nhận
        </Button>,
        <Button key="back" type="primary" className="bg-secondary rounded-full text-white h-8  px-10 py-1" onClick={onClose}>
          Hủy
        </Button>
      ]}
    >
      <div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="lg:flex gap-6">
            <div className="lg:w-[66%] flex flex-col gap-4">
              <div className="relative flex-grow">
                <span className="absolute z-10 top-[-12px] left-2 bg-white px-1">
                  Tên sản phẩm
                </span>
                <Input
                  value={product?.title}
                  name="title"
                  register={register}
                  className="min-w-30"
                  errorMessage={errors.title?.message}
                />
              </div>
              <div className="flex gap-6 justify-between">
                <div className="relative  w-40">
                  <span className="absolute z-10 top-[-12px] left-2 bg-white px-1">
                    Giá
                  </span>
                  <Input
                    value={product?.price}
                    name="price"
                    register={register}
                    className="min-w-30 "
                    errorMessage={errors.price?.message}
                  />
                </div>
                <div className="relative ">
                  <span className="absolute z-10 top-[-12px] left-2 bg-white px-1">
                    Số lượng
                  </span>
                  <Input
                    value={product?.quantity}
                    name="quantity"
                    register={register}
                    className="min-w-30"
                    errorMessage={errors.quantity?.message}
                  />
                </div>
                <div className="relative ">
                  <span className="absolute z-10 top-[-12px] left-2 bg-white px-1">
                    Xuất xứ
                  </span>
                  <Input
                    value={product?.origin}
                    name="origin"
                    register={register}
                    className="min-w-30"
                    errorMessage={errors.origin?.message}
                  />
                </div>
                <div className="relative">
                  <span className="absolute z-10 top-[-12px] left-2 bg-white px-1">
                    Phân loại
                  </span>
                  <select
                    id="category"
                    name="category"
                    {...register("category")}
                    className="min-w-30 h-[45px] border border-gray-300 rounded-full px-4 py-1 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Chọn phân loại</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="mt-1 min-h-[1.25rem] text-sm text-red-600">{errors.category.message}</span>
                  )}
                </div>
              </div>

              <div className="relative flex-grow">
                <span className="absolute z-10 top-[-12px] left-2 bg-white px-1">
                  Mô tả
                </span>
                <textarea
                  defaultValue={product?.description || ""}
                  name="description"
                  {...register("description")}
                  className="min-w-30 w-full h-52 border rounded-lg p-5"
                />
                {errors.description && (
                  <span className="mt-1 min-h-[1.25rem] text-sm text-red-600">
                    {errors.description.message}
                  </span>
                )}
              </div>


            </div>

            <div className="border-l border-background lg:pl-5 flex-grow items-center flex justify-center flex-col gap-4 mt-4 lg:mt-0">
              <div className="w-60 h-60  rounded-3xl overflow-hidden border border-smokeBlack">
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="border rounded-md px-4 py-1 border-smokeBlack text-gray cursor-pointer">
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        </form>

      </div>
    </Modal>
  </>
}

ProductForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    origin: PropTypes.string,
    quantity: PropTypes.number,
    price: PropTypes.number,
    image: PropTypes.string,
    category: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  })
};