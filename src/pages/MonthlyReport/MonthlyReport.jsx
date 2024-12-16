import { DatePicker } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchemas } from "../../validations/ValidationSchemas";
import reportApi from '../../apis/report.api';
import dayjs from 'dayjs';
import Loading from '../../components/Loading';
import { Line } from '@ant-design/charts';

const schema = yup.object({
  date: validationSchemas.date,
})

export default function MonthlyReport() {

  const {
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: dayjs().startOf('month').toDate(),
    },
  });


  const selectedDate = watch('date');

  const month = selectedDate ? dayjs(selectedDate).month() + 1 : null;
  const year = selectedDate ? dayjs(selectedDate).year() : null;

  const { data, isLoading } = useQuery({
    queryKey: ['report-orders', month, year],
    queryFn: () => reportApi.getOrderReportByMonthAndYear(month, year),
    enabled: !!selectedDate,
    keepPreviousData: true,
    select: (result) => result.data.data
  });

  const config = {
    data: data?.orderDateCounts,
    height: 200,
    xField: 'day',
    yField: 'count',
  };

  return (
    <div className="mx-3 bg-white w-full">
      <div className="p-5">
        <div className="flex gap-4 items-center">
          <h2>Số lượng đơn hàng trong tháng</h2>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker
                {...field}
                picker="month"
                value={field.value ? dayjs(field.value) : null}
                onChange={(date, dateString) => field.onChange(date ? date.toDate() : null)}
              />
            )}
          />
          {errors.date && <p className="text-red-500">{errors.date.message}</p>}
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className='flex flex-col'>
            <Line {...config} />
            <div className="flex  items-center gap-4 p-4">
              <div className="bg-white flex gap-3 shadow-md rounded-lg w-full max-w-md p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-700">Tổng số đơn hàng</h3>
                <p className="text-2xl font-bold text-green-600">{data.total}</p>
              </div>
              <div className="bg-white flex gap-3 shadow-md rounded-lg w-full max-w-md p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-700">Số đơn đã hủy</h3>
                <p className="text-2xl font-bold text-red-500">{data.countOfCancel}</p>
              </div>
              <div className="bg-white flex gap-3 shadow-md rounded-lg w-full max-w-md p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-700">Doanh thu dự kiến</h3>
                <p className="text-2xl font-bold text-purple-600">{data.projectedRevenue}</p>
              </div>
              <div className="bg-white flex gap-3 shadow-md rounded-lg w-full max-w-md p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-700">Doanh thu thực tế</h3>
                <p className="text-2xl font-bold text-blue-600">{data.actualRevenue}</p>
              </div>
              
            </div>
          </div>
        )}
      </div>


    </div>
  );
}