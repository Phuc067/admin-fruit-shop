import { useState, useEffect } from "react";
import { Modal } from "antd";
import Input from "../../../../components/Input"
import Button from "../../../../components/Button";
import PropTypes from "prop-types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import categoryAPi from "../../../../apis/category.api";
import productApi from "../../../../apis/product.api";
import { uploadImageToFS, deleteImageFromFS } from "../../../../services/FirebaseStorage/FirebaseStorage";
import showToast from "../../../../components/ToastComponent";
import HttpStatusCode from "../../../../constants/httpStatusCode.enum";

const schema = yup.object({
  title: yup.string().required('Tên sản phẩm là bắt buộc'),
  price: yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Giá là bắt buộc')
    .positive('Giá phải là số dương'),
  quantity: yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required('Số lượng là bắt buộc')
    .positive('Số lượng phải là số dương'),
  origin: yup.string().required('Xuất xứ là bắt buộc'),
  categoryId: yup.string().required('Bạn chưa chọn phân loại')
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
    watch,
    setValue,
    formState: { errors },
    reset } = useForm({ resolver: yupResolver(schema) });

  const [imagePreview, setImagePreview] = useState(product?.image);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          title: product.title,
          price: product.price,  
          quantity: product.quantity,
          origin: product.origin,
          categoryId: product.category?.id,
          description: product.description
        });
        setImagePreview(product.image);
      } else {
        reset({
          title: '',
          price: '',
          quantity: '', 
          origin: '',
          categoryId: '',
          description: ''
        });
        setImagePreview(null);
      }
    }
  }, [open, product, reset]);

  const { data: categories, isLoading: loadingCategories } = useQuery(
    {
      queryKey: ['categories'],
      queryFn: () => categoryAPi.getAllCategory().then((res) => res?.data?.data || []),
      enabled: open
    }
  );

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

  const createMutation = useMutation({
    mutationFn: (body) => productApi.createProduct(body),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => productApi.updateProduct(id, body),
  })

  const handleFormSubmit = async (data) => {

    console.log(data);
    let imageUrl = imagePreview;

    if (imagePreview.startsWith("blob:")) {
      setIsLoading(true);
      const response = await uploadImageToFS(
        document.querySelector('input[type="file"]').files[0]
      );
      imageUrl = response;
      setIsLoading(false);
    }

    const formData = {
      ...data,
      image: imageUrl
    }
    const productId = product?.id;
    const mutation = product ? updateMutation : createMutation;
    mutation.mutate(
      product
        ? { id: productId, body: formData }
        : formData,
    {
      onSuccess: (response) => {
        if (response.data.status === HttpStatusCode.Accepted) {
          showToast(response.data.message, "success");
          reset();
          onSubmit();
          product =null;
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
    product =null;
    setImagePreview(null);
    onClose();
    
  }

  return <>
    <Modal
      className=""
      open={open}
      width={2000}
      title=<div className="justify-center flex py-4">{product ? "Sửa thông tin sản phẩm" : "Thêm sản phẩm"}</div>
      onOk={handleSubmit(handleFormSubmit)}
      onCancel={handleCancel}
      footer={[
        <Button
          isLoading={isLoading || createMutation.isLoading || updateMutation.isLoading}
          disabled={isLoading || createMutation.isLoading || updateMutation.isLoading}
          key="submit"
          onClick={handleSubmit(handleFormSubmit)}
          className="bg-primary rounded-full text-white h-8 px-10 py-1 mr-10"
        >
          Xác nhận
        </Button>,
        <Button
          key="back"
          type="primary"
          className="bg-secondary rounded-full text-white h-8 px-10 py-1"
          onClick={handleCancel}
        >
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
                  defaultValue={product?.title}
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
                    defaultValue={product?.price}
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
                    defaultValue={product?.quantity}
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
                    defaultValue={product?.origin}
                    name="origin"
                    register={register}
                    className="min-w-30"
                    errorMessage={errors.origin?.message}
                  />
                </div>
                <div className="relative flex flex-col">
                  <span className="absolute z-10 top-[-12px] left-2 bg-white px-1">
                    Phân loại
                  </span>
                  <select
                    id="category"
                    name="categoryId"
                    {...register("categoryId")}
                    value={watch("categoryId") || product?.category?.id || ""}
                    onChange={(e) => {
                      setValue("categoryId", e.target.value);
                    }}
                    className="min-w-30 h-[45px] border border-gray-300 rounded-full px-4 py-1 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Chọn phân loại</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <span className="mt-1 min-h-[1.25rem] text-sm text-red-600">{errors.categoryId.message}</span>
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
                  className="min-w-30 w-full h-52 border rounded-lg p-3"
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
                  src={imagePreview|| '/white-pic.jpg'}
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
    id: PropTypes.number,
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