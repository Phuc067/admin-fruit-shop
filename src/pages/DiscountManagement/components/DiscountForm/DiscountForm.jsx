import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { Modal, Select } from "antd";
import { DatePicker, } from 'antd';

import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { useState, useEffect } from "react";
import { validationSchemas } from "../../../../validations/ValidationSchemas";
import { formatDateMinus7Hours } from "../../../../utils/utils";
import productApi from "../../../../apis/product.api";
import { useQuery, useMutation } from "@tanstack/react-query";
import discountApi from "../../../../apis/discount.api";
import HttpStatusCode from "../../../../constants/httpStatusCode.enum";
import showToast from "../../../../components/ToastComponent";

const schema = yup.object({
  effectiveDate:
    yup.date()
      .required("Vui lòng chọn thời gian bắt đầu")
      .typeError("Thời gian bắt đầu không hợp lệ")
      .min(new Date(), "Thời gian bắt đầu phải sau thời điểm hiện tại"),
  expiryDate:
    yup.date()
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

  const { register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }, reset } = useForm({
      resolver: yupResolver(schema)
    });
  const selectedProducts = watch("products") || [];
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["productIdAndTitle"],
    queryFn: () => productApi.getIdAndTitle(),
    keepPreviousData: true,
    select: (result) => result.data.data,
  })

  const createMutation = useMutation({
    mutationFn: (body) => discountApi.createDiscount(body),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => discountApi.updateDiscount(id, body),
  })


  const handleFormSubmit = (data) => {
    const discountId = discount?.id;
    const mutation = discount ? updateMutation : createMutation;
    console.log("data: ", data);
    mutation.mutate(
      discount
        ? { id: discountId, body: data }
        : data,
      {
        onSuccess: (response) => {
          if (response.data.status === HttpStatusCode.Accepted) {
            showToast(response.data.message, "success");
            reset();
            onSubmit();
            discount = null;
          }
          else {
            showToast(response.data.message, "error");
          }
        },
        onError: (error) => {
          console.log(error);

        }
      })
  }

  const handleCancel = () => {
    reset();
    onClose();
  }

  const productOptions = products?.map((product) => ({
    value: product.id,
    label: product.title,
  }));

  return <>
    <Modal
      className=""
      open={open}
      width={1000}
      title=<div className="justify-center flex py-4">{discount ? "Sửa thông tin khuyến mãi" : "Thêm khuyến mãi"}</div>
      onOk={handleSubmit(handleFormSubmit)}
      onCancel={handleCancel}
      footer={[
        <Button
          isLoading={isLoading || createMutation.isLoading || updateMutation.isLoading}
          disabled={isLoading || createMutation.isLoading || updateMutation.isLoading}
          key="submit"
          onClick={handleSubmit(handleFormSubmit)}
          className="bg-primary rounded-full text-white h-8 px-10 py-1 mr-10" >
          Xác nhận
        </Button>,
        <Button
          key="back"
          type="primary"
          className="bg-secondary rounded-full text-white h-8  px-10 py-1"
          onClick={handleCancel}>
          Hủy
        </Button>
      ]}
    >
      <div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="lg:flex gap-6">
            <div className="w-full flex flex-col gap-4">
              <div className={`flex ${discount ? 'disabled' : ''}`}>
                <div className="relative flex flex-col">
                  <span className="absolute z-10  top-[-20px] left-2 bg-white px-1">
                    Thời gian bắt đầu
                  </span>
                  <DatePicker name="effectiveDate"
                    // defaultValue={discount?.effectiveDate ? formatDateMinus7Hours(discount.effectiveDate) : null}
                    {...register("effectiveDate")}
                    value={watch("effectiveDate") || null}
                    onChange={(date) => setValue("effectiveDate", date)}
                    showTime />
                  <span className="mt-1 min-h-[1.25rem] text-sm text-red-600">{errors.effectiveDate?.message}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-background mx-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>

                <div className="relative flex flex-col">
                  <span className="absolute z-10 top-[-20px] left-2 bg-white px-1">
                    Thời gian kết thúc
                  </span>
                  <DatePicker name="expiryDate"
                    // defaultValue={discount?.expiryDate ? formatDateMinus7Hours(discount.expiryDate) : null} 
                    {...register("expiryDate")}
                    value={watch("expiryDate") || null}
                    onChange={(date) => setValue("expiryDate", date)}
                    showTime />
                  <span className="mt-1 min-h-[1.25rem] text-sm text-red-600">{errors.expiryDate?.message}</span>
                </div>
              </div>
              <div className="flex justify-center items-center mt-4 gap-10">
                <div className="relative flex-grow flex flex-col">
                  <span className="absolute z-10  top-[-20px] left-2 bg-white px-1">
                    Danh sách sản phẩm
                  </span>
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Chọn sản phẩm"
                    value={selectedProducts.length ? selectedProducts : discount?.products?.map(product => product.id) || []}
                    {...register("products")}
                    onChange={(selected) => setValue("products", selected)}
                    options={productOptions}
                  />
                  <span className="mt-1 min-h-[1.25rem] text-sm text-red-600">{errors.products?.message}</span>
                </div>
                <div className="relative ">
                  <span className="absolute z-10 top-[-20px] left-2 bg-white px-1">
                    Phần trăm giảm giá
                  </span>
                  <Input
                    defaultValue={discount?.value}
                    name="value"
                    register={register}
                    classNameInputCustom="max-w-60"
                    errorMessage={errors.value?.message}
                  />
                </div>
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