import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import * as yup from 'yup';
import { Modal, Select } from "antd";
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { useState,useEffect } from "react";
import { validationSchemas } from "../../../../validations/ValidationSchemas";
import { formatDateMinus7Hours } from "../../../../utils/utils";


const schema = yup.object({
  effectiveDate: yup
    .date()
    .required("Vui lòng chọn thời gian bắt đầu")
    .typeError("Thời gian bắt đầu không hợp lệ"),
  expiryDate: yup
    .date()
    .required("Vui lòng chọn thời gian kết thúc")
    .typeError("Thời gian kết thúc không hợp lệ")
    .min(yup.ref("effectiveDate"), "Thời gian kết thúc phải sau thời gian bắt đầu"),
  value: validationSchemas.value,
  products: yup
    .array()
    .required("Vui lòng chọn ít nhất một sản phẩm")
    .min(1, "Danh sách sản phẩm không được rỗng"),
})

export default function DiscountForm({ open, onSubmit, onClose, discount }) {

  console.log(discount);

  const { register,
    handleSubmit,
    control,
    formState: { errors }, reset } = useForm({
      resolver: yupResolver(schema)
    });

  const handleFormSubmit = () => {

  }

  const handleCancel = () => {
    onClose();
  }

  const handleChangeProduct = (selected) => {
    setSelectedProducts(selected);
  }

  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (discount?.products) {
      setSelectedProducts(discount.products.map(product => product.id));
    }
  }, [discount]); 
  console.log("selected product: ", selectedProducts);
  
  const productOptions = discount?.products?.map((product) => ({
    value: product.id,
    label: product.title,
  }));

  console.log("Options", productOptions);
  
  return <>
    <Modal
      className=""
      open={open}
      width={1000}
      title=<div className="justify-center flex py-4">{discount ? "Sửa thông tin khuyến mãi" : "Thêm khuyến mãi"}</div>
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button key="submit" onClick={handleSubmit(handleFormSubmit)} className="bg-primary rounded-full text-white h-8 px-10 py-1 mr-10" >
          Xác nhận
        </Button>,
        <Button key="back" type="primary" className="bg-secondary rounded-full text-white h-8  px-10 py-1" onClick={handleCancel}>
          Hủy
        </Button>
      ]}
    >
      <div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="lg:flex gap-6">
            <div className="w-full flex flex-col gap-4">
              <div className="flex">
                <div className="relative">
                  <span className="absolute z-10  top-[-20px] left-2 bg-white px-1">
                    Thời gian bắt đầu
                  </span>
                  <DatePicker name="effectiveDate" defaultValue={discount?.effectiveDate ? formatDateMinus7Hours(discount.effectiveDate) : null} register={register} showTime />
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-background mx-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>

                <div className="relative ">
                  <span className="absolute z-10 top-[-20px] left-2 bg-white px-1">
                    Thời gian kết thúc
                  </span>
                  <DatePicker name="expiryDate" defaultValue={discount?.expiryDate ? formatDateMinus7Hours(discount.expiryDate) : null} register={register} showTime />
                </div>
              </div>
              <div className="relative mt-4">
                <span className="absolute z-10  top-[-20px] left-2 bg-white px-1">
                  Danh sách sản phẩm
                </span>
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Chọn sản phẩm"
                  value={selectedProducts}
                  onChange={handleChangeProduct}
                  options={productOptions}
                />
              </div>
              <div>
                <span className="absolute z-10 top-[-20px] left-2 bg-white px-1">
                  Phần trăm giảm giá
                </span>
                <Input
                  defaultValue={discount?.value}
                  name="value"
                  register={register}
                  className="min-w-30"
                  errorMessage={errors.origin?.message}
                />
              </div>
            </div>
          </div>
        </form>

      </div>
    </Modal>
  </>
}

DiscountForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  discount: PropTypes.object
};