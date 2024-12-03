import { useState, useEffect, useContext } from "react";
import { Modal } from "antd";
import Input from "../../../components/Input"
import Button from "../../../components/Button";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchemas } from "../../../validations/ValidationSchemas"
import { useForm } from "react-hook-form";

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

  const [imagePreview, setImagePreview] = useState(product?.image);

  useEffect(() => {
    setImagePreview(product?.image || null);
  }, [product]);

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
      open={open}
      width={2000}
      title="Sửa thông tin sản phẩm"
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
          <div className="lg:flex">
            <div className="w-[66%] flex flex-col gap-4">
              <div className="relative flex-grow">
                <span className="absolute z-10 top-[-12px] left-2 bg-white px-1">
                  Tên sản phẩm
                </span>
                <Input
                  value={product?.title}
                  name="recipientName"
                  register={register}
                  className="min-w-30"
                  errorMessage={errors.title?.message}
                />
              </div>
              <label>
                Giá:
                <Input type="number" {...register("price", { required: "Giá không được bỏ trống" })} placeholder="Nhập giá sản phẩm" />
              </label>
              <label>
                Số lượng:
                <Input type="number" {...register("quantity", { required: "Số lượng không được bỏ trống" })} placeholder="Nhập số lượng sản phẩm" />
              </label>
              <label>
                Phần trăm giảm giá:
                <Input type="number" {...register("discountPercentage")} placeholder="Nhập phần trăm giảm giá (nếu có)" />
              </label>
            </div>

            <div className="border-l border-background ml-5 pl-5 flex-grow items-center flex justify-center flex-col gap-4">
              <div className="w-40 h-40 rounded-full overflow-hidden">
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
    price: PropTypes.number,
    image: PropTypes.string,
    category: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  })
};