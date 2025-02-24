import { useEffect, useState, useMemo } from 'react';
import { useDebounce } from '../../../../../utils/useDebounce';
import { getAllLedgerData, searchLedger } from '../../../../../services/api/userAuth';
import { Columns } from '../components/LedgerUtils';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useSelector, useDispatch } from 'react-redux';
import LedgerTableTopbar from '../components/LedgerTableTopbar';
import { format } from 'date-fns';
import { updateColumnSize } from '../../../../../features/profile/legerSlice';

export default function BasicTable() {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const columnSizes = useSelector((state) => state.ledger);
  const itemsPerPage = 10;
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setsort] = useState('newest');
  const [filterText, setFilterText] = useState('');
  const [selectedOption, setSelectedOption] = useState(false);
  const debouncedSearch = useDebounce(filterText, 1000);
  const [ledgerData, setLedgerData] = useState([]);
  // const [pagination, setPagination] = useState('')

  // const { data } = useQuery({
  //   queryFn: () => {
  //     if (debouncedSearch === '') {
  //       return getAllLedgerData(currentPage, itemsPerPage, sort);
  //     } else {
  //       return searchLedger(currentPage, itemsPerPage, sort, debouncedSearch);
  //     }
  //   },
  //   queryKey: ['ledgerData', sort, debouncedSearch],
  // });

  // let ledgerData;
  const fetchData = async () => {
    try {
      const data = await getAllLedgerData(currentPage, itemsPerPage, sort);
      if (data) {
        setLedgerData(data);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const findingLedger = async () => {
    try {
      const uuid = localStorage.getItem('uuid');
      const data = await searchLedger(uuid, currentPage, itemsPerPage, sort, debouncedSearch);
      if (data) {
        setLedgerData(data);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    if (debouncedSearch === '') {
      fetchData();
    } else {
      findingLedger();
    }
  }, [sort, debouncedSearch, currentPage]);

  // const [{ pageIndex, pageSize }, setPagination] =
  // React.useState({
  //   pageIndex: 0,
  //   pageSize: 10,
  // })

  // const pagination = React.useMemo(
  //   () => ({
  //     pageIndex,
  //     pageSize,
  //   }),
  //   [pageIndex, pageSize]
  // )
  // table.getHeaderGroups()[0].headers.forEach((header) => {

  //   const columnId = header.id;
  //   const size = columnSizes[columnId];
  //   if (size) {
  //     header.setWidth(size);
  //   }

  // });

  const columns = useMemo(() => {
    const tempColumns = Columns.map((column) => {
      const id = column.accessorKey;
      const size = columnSizes[id];
      return {
        ...column,
        size: size || column.size,
      };
    });

    return tempColumns;
  }, [Columns]);

  const table = useReactTable({
    data: ledgerData?.data?.data || [],
    columns,
    // state: {
    //   pagination,
    // },
    // onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: 'onChange', // onChange onEnd
  });

  //   custom pagination
  useEffect(() => {
    setTotalPages(Math.ceil(ledgerData?.data?.totalCount / rowsPerPage));
  }, [ledgerData?.data?.totalCount, rowsPerPage]);

  const handlePageClick = async (page) => {
    setCurrentPage(page);
    // table.setPageIndex(page - 1);
    // console.log(page);
    // const data = await getAllLedgerData(page, itemsPerPage, sort);
    // if (data) {
    //   setLedgerData(data);
    // }
  };

  const visibleButtons = 5;
  const rangeStart = Math.max(1, currentPage - Math.floor(visibleButtons / 2));
  const rangeEnd = Math.min(totalPages, rangeStart + visibleButtons - 1);

  // useEffect(() => {
  //   return () => {
  //     table.getHeaderGroups()[0].headers.forEach((header) => {
  //       const columnId = header.id;
  //       const size = header.getSize();
  //       dispatch(updateColumnSize({ columnId, size: size }));
  //     });
  //   };
  // }, [columnSizes, table]);

  useEffect(() => {
    table.getHeaderGroups()[0].headers.forEach((header) => {
      const columnId = header.id;
      const size = header.getSize();
      dispatch(updateColumnSize({ columnId, size: size }));
    });
  }, [columnSizes, table, table.getState().columnSizingInfo.isResizingColumn]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  return (
    <div className="mb-6 overflow-y-auto">
      <div className="ledger-light dark:ledger-dark mx-[17px] mb-2 rounded-[7.89px] bg-white px-[0.59rem] py-[13px] text-left dark:border-[2.56px] dark:border-gray-100 dark:bg-gray-200 tablet:mx-6 tablet:rounded-[10.4px] tablet:px-[1.36rem] tablet:py-[30px] laptop:mx-[106px] laptop:rounded-[45px]">
        <LedgerTableTopbar
          sort={sort}
          setsort={setsort}
          filterText={filterText}
          setFilterText={setFilterText}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <div className="w-full overflow-auto no-scrollbar tablet:h-[600px]">
          <table
            className="w-full"
            // style={{ width: table.getCenterTotalSize() }}
            // style={{
            //   minWidth:
            //     window.innerWidth <= 1700 && window.innerWidth >= 744
            //       ? '600px'
            //       : window.innerWidth <= 744 && window.innerWidth >= 0
            //         ? '350px'
            //         : 'auto',
            //   width:
            //     window.innerWidth <= 1700 && window.innerWidth >= 900
            //       ? '100%'
            //       : window.innerWidth <= 900 && window.innerWidth >= 744
            //         ? '120%'
            //         : window.innerWidth <= 744 && window.innerWidth >= 0
            //           ? '100%'
            //           : table.getCenterTotalSize(),
            // }}
            // {...{
            //   style: {
            //     width: table.getCenterTotalSize(),
            //   },
            // }}
          >
            <thead
              style={{ width: table.getTotalSize() }}
              className="text-gray-1 text-[0.4rem] dark:text-gray-300 tablet:text-[1rem] laptop:text-[1.2rem]"
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  // className="border-0 border-b border-[#EEEEEE]"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      // style={{ width: header.getSize() }}
                      className="relative py-1 font-normal tablet:py-3"
                      // key={header.id}
                      {...{
                        key: header.id,
                        colSpan: header.colSpan,
                        style: {
                          width: header.getSize(),
                        },
                      }}
                    >
                      {/* {console.log(
                        "🚀 ~ file: Ledger.jsx:183 ~ BasicTable ~ header.getSize():",
                        header.getSize(),
                      )}
                      {console.log(
                        "🚀 ~ file: Ledger.jsx:188 ~ BasicTable ~ header.column.columnDef.size:",
                        header.column.columnDef.size,
                      )} */}
                      {/* {header.column.columnDef.header} */}
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      <div
                        // onMouseDown={header.getResizeHandler()}
                        // onTouchStart={header.getResizeHandler()}
                        // className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""
                        //   }`}
                        {...{
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                          // style: {
                          //   transform:
                          //     columnResizeMode === 'onEnd' &&
                          //     header.column.getIsResizing()
                          //       ? `translateX(${
                          //           table.getState().columnSizingInfo.deltaOffset
                          //         }px)`
                          //       : '',
                          // },
                        }}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="relative text-[0.65rem] font-medium -tracking-[0.0125rem] tablet:text-[1rem] laptop:text-[0.875rem]">
              {table.getRowModel().rows.length === 0 ? (
                <tr className="absolute left-1/2 top-1/2 mt-5 h-full -translate-x-1/2 -translate-y-1/2">
                  <td className="mt-3 text-center text-[0.4rem] md:text-[.88rem] tablet:mt-10 laptop:text-[1.2rem]">
                    No results found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="text-gray whitespace-nowrap border-0 border-b border-[#EEEEEE] dark:text-gray-300"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        className="truncate py-1 text-[0.4rem] tablet:py-3 tablet:text-[.88rem] laptop:text-[1.2rem]"
                        {...{
                          key: cell.id,
                          style: {
                            width: cell.column.getSize(),
                            maxWidth: cell.column.getSize(),
                          },
                        }}
                      >
                        {cell.column.id === 'txID'
                          ? `${cell.getValue().slice(0, 4)}..${cell.getValue().slice(-3)}`
                          : cell.column.id === 'txDate'
                            ? format(new Date(cell.getValue()), 'MMM dd yyyy, hh:mm a')
                            : cell.column.id === 'txFrom' &&
                                cell.getValue() !== 'DAO Treasury' &&
                                cell.getValue() !== 'dao' &&
                                cell.getValue() !== persistedUserInfo?.uuid
                              ? `User`
                              : cell.getValue() === persistedUserInfo?.uuid
                                ? 'My Account'
                                : cell.column.id === 'txTo' &&
                                    cell.getValue() !== 'DAO Treasury' &&
                                    cell.getValue() !== 'dao'
                                  ? `User`
                                  : cell.getValue() === 'dao'
                                    ? 'DAO'
                                    : cell.getValue()}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="max-[880px]:justify-center mt-2 flex flex-wrap items-center justify-end gap-3 tablet:-mt-7 laptop:mt-6">
          {/* <p className="text-[0.44rem] text-[#B5B7C0] tablet:text-[1rem] ">
            Showing data {(table.getState().pagination.pageIndex + 1) * 10 - 9}{" "}
            to {(table.getState().pagination.pageIndex + 1) * 10} of{" "}
            {ledgerData?.data?.totalCount} entries
          </p> 
          <p></p>*/}
          <div
            className={`flex items-center gap-2 tablet:gap-3.5 laptop:mr-[3.46rem] ${rangeStart === 1 && rangeEnd === 0 ? 'hidden' : ''}`}
          >
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === rangeStart && true}
              className="pagination-btn"
            >
              <img
                className="h-[0.43rem] w-[0.31rem] tablet:h-[14px] tablet:w-[9px]"
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-back.svg`}
                alt=""
              />
            </button>
            <div className="flex items-center gap-[0.46rem] tablet:gap-4">
              {rangeStart > 1 && (
                <button className="bg-white/0 text-[9px] font-medium text-black dark:text-[#B3B3B3] tablet:text-[16px]">
                  ...
                </button>
              )}
              {rangeStart && rangeEnd
                ? [...Array(rangeEnd - rangeStart + 1)].map((_, index) => {
                    const pageNumber = rangeStart + index;
                    return (
                      <button
                        className={`flex h-[0.91rem] w-[0.92rem] items-center justify-center rounded-[0.15rem] pt-[2px] text-[0.45rem] tablet:h-[28px] tablet:w-[27px] tablet:rounded-md tablet:pt-[0px] tablet:text-[13px] ${
                          pageNumber === currentPage
                            ? 'border border-solid border-[#5932EA] bg-[#4A8DBD] text-white dark:border-none dark:bg-gray-500'
                            : 'text-gray bg-[#F5F5F5] dark:bg-gray-300'
                        }`}
                        key={pageNumber}
                        onClick={() => handlePageClick(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  })
                : null}
              {rangeEnd < totalPages && (
                <button className="bg-white/0 text-[9px] font-medium text-black dark:text-gray-300 tablet:text-[16px]">
                  ...
                </button>
              )}
            </div>
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === rangeEnd && true}
              className="pagination-btn"
            >
              <img
                className="h-[0.43rem] w-[0.31rem] tablet:h-[14px] tablet:w-[9px]"
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-forward.svg`}
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
      <p className="mx-[17px] px-[0.59rem] text-end text-[0.4rem] tablet:px-[1.36rem] tablet:text-[1rem] laptop:mx-[116px]">
        Powered by Foudation Blockchain
      </p>
    </div>
  );
}
