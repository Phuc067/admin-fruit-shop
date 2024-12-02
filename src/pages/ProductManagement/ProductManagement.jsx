import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import productApi from "../../apis/product.api";

export default function ProductManagement() {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      search: "",
      sort: "",
    },
  });

  const formValues = watch();

  const { data: products = [] } = useQuery({
    queryKey: ["products", formValues],
    queryFn: () =>
      productApi.getProducts({
        keyword: formValues.search,
        sortType: formValues.sort,
      }),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000,
    select: (result) => result.data.data,
  });

  const onSubmit = () => {
    
  };

  console.log(products);
  return (
    <>
      <div className=" mx-3 bg-white w-full rounded-md">
        <div className="w-full flex justify-center  mt-4">
          <form  onSubmit={handleSubmit(onSubmit)} 
            className="hidden  md:flex gap-4">
            <div className="flex rounded-full border-2 border-primary w-[350px] bg-white p-1">
              <input
                type="text"
                {...register("search")}
                className="flex-grow rounded-full border-none bg-transparent px-3 py-1 text-black outline-none"
                placeholder="Tìm kiếm sản phẩm"
              />
              <button
                type="submit"
                className="flex-shrink-0 rounded-full bg-primary px-4 py-1 hover:opacity-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <label
                htmlFor="sort"
                className="text-sm font-medium text-gray-700"
              >
                Sắp xếp theo:
              </label>
              <select
               {...register("sort")}
                id="sort"
                name="sort"
                className="border border-gray-300 rounded-full px-4 py-1 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value=""></option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="highest_discount">Giảm giá cao nhất</option>
              </select>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
