import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axiosInstance from '../../Axios';
import { formatDate } from '../date-time/defaultDateFormat';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Menu, MenuItem, TableFooter, TablePagination, Tooltip, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import Confirm from '../dialogs/DialogForm_1';
import { useSnackbar } from 'notistack';
import CustomLinearProgress from '../progress/LinerProgress';
import DefaultProgress from '../progress/Default';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { NoVideos } from '../no-data/NoVideos';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './users.css';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import { Helmet } from 'react-helmet';
import { SearchField } from '../inputs/CustomFields';


function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const SubscriptionActionsMenu = ({ row, setClickedSubscriptions, setClickAction, setOpenAlert }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="المزيد">
        <IconButton
          aria-label="more"
          onClick={handleClick}
          aria-controls={open ? 'subscription-actions-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>

      <Menu
        id="subscription-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              boxShadow: '0px 1px 10px 1px var(--main-shadow)',
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {row.is_active ? (
          <MenuItem
            onClick={() => {
              setClickedSubscriptions(row.id);
              setClickAction({ delete: false, activations: true });
              setOpenAlert(true);
            }}
            className='d-flex gap-3 justify-content-end'
          >
            إلغاء التفعيل
            <BlockIcon />
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setClickedSubscriptions(row.id);
              setClickAction({ delete: false, activations: true });
              setOpenAlert(true);
            }}
            className='d-flex gap-3 justify-content-end'
          >
            تفعيل
            <CheckCircleIcon />
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setClickedSubscriptions(row.id);
            setClickAction({ delete: true, activations: false });
            setOpenAlert(true);
          }}
          className='d-flex gap-3 justify-content-end'
        >
          حذف الإشتراك
          <DeleteIcon />
        </MenuItem>
      </Menu>
    </>
  );
};

export default function Subscriptions() {
  const [loading, setLoading] = React.useState(true);
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);
  const [subscriptions, setSubscriptions] = React.useState([]);
  const [clickedSubscriptions, setClickedSubscriptions] = React.useState(null);
  const [clickAction, setClickAction] = React.useState({
    activations: false,
    delete: false
  });


  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subscriptions.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // snackbar
  const { enqueueSnackbar } = useSnackbar();

  const handleClickVariant = (msg, variant) => {
    enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: "top", horizontal: "right" } });
  };

  // alert
  const [openAlert, setOpenAlert] = React.useState(false);

  // updates
  const deleteSubscription = async () => {
    setLoadingUpdate(true);
    try {
      const res = await axiosInstance.delete(`api/admin/courses/subscriptions/${clickedSubscriptions}/delete/`);
      if (res.status === 204) {
        handleClickVariant('تم حذف الإشتراك بنجاح', 'success');
        getSubscriptions();
      } else {
        handleClickVariant('حدث خطأ ما', 'error');
      }
    } catch (error) {
      handleClickVariant('حدث خطأ ما', 'error');
    } finally {
      setLoadingUpdate(false);
    }
  }

  const updateSubscription = async () => {
    setLoadingUpdate(true);
    try {
      await axiosInstance.patch(`api/admin/courses/subscriptions/${clickedSubscriptions}/update/`, {
        is_active: !subscriptions.find(obj => obj.id === clickedSubscriptions).is_active
      });
      handleClickVariant('تم تحديث حالة الإشتراك بنجاح', 'success');
      getSubscriptions();
    } catch (error) {
      handleClickVariant('حدث خطأ ما', 'error');
    } finally {
      setLoadingUpdate(false);
    }
  }

  // get subscriptions
  const getSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('api/admin/courses/subscriptions/');
      if (res.status === 200) {
        setSubscriptions(res.data);
      } else {
        handleClickVariant('حدث خطأ ما', 'error');
      }
    } catch (error) {
      handleClickVariant('حدث خطأ ما', 'error');
    } finally {
      setLoading(false);
    }
  }

  const [searchQuery, setSearchQuery] = React.useState('');
  const handleSearchChange = async (e) => {
    let value = e.target.value;
    setSearchQuery(value);
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/admin/courses/subscriptions/search/`, { params: { value } });
      setSubscriptions(response.data);
    } catch (error) {
      handleClickVariant('لقد حدث خطأ لايمكن الحصول علي نتيجة', 'error');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    getSubscriptions();
  }, [])

  return (
    <>
      <Helmet>
        <title>Engineering Sozy | الإشتراكات</title>
      </Helmet>
      <div className='search-container mt-4 mb-4'>
        <SearchField
          label="البحث عن مشتركين"
          placeholder="البحث عن مشتركين  (البريد الإلكتروني ، اسم المستخدم ، ID)  "
          onChange={handleSearchChange}
        />
      </div>
      <CustomLinearProgress loading={loadingUpdate} />
      {
        loading ? <DefaultProgress sx={{ width: '100%', height: '70vh', display: 'flex' }} />

          :
          subscriptions.length > 0 ?
            <TableContainer className='table-container' component={Paper} dir='rtl' sx={{ width: '100%', overflowX: 'auto' }}>
              <Table aria-label="collapsible pagination table" sx={{ width: '100%', backgroundColor: 'var(--main-back3)' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'var(--main-back)' }}>
                    <TableCell />
                    <TableCell align="right" sx={{ fontSize: '1.1rem', fontWeight: 'bold', whiteSpace: 'nowrap', color: 'var(--main-blue-sky)' }}><span>البريد الإلكتروني</span></TableCell>
                    <TableCell align="right" sx={{ fontSize: '1.1rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}><span>إسم المشترك</span></TableCell>
                    <TableCell align="right" sx={{ fontSize: '1.1rem', fontWeight: 'bold', whiteSpace: 'nowrap', color: 'var(--main-blue-sky)' }}><span>ID</span></TableCell>
                    <TableCell align="right" sx={{ fontSize: '1.1rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}><span>الكورس</span></TableCell>
                    <TableCell align="right" sx={{ fontSize: '1.1rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}><span>ناريخ إنشاء الإشتراك</span></TableCell>
                    <TableCell align="right" sx={{ fontSize: '1.1rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}><span>الحالة</span></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? subscriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : subscriptions
                  ).map((row, i) => (
                    <TableRow key={i} sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: 'var(--main-back)' }} colSpan={9}>
                      <TableCell sx={{ fontSize: '1.1rem', whiteSpace: 'nowrap' }} align="right">
                        <SubscriptionActionsMenu
                          row={row}
                          setClickedSubscriptions={setClickedSubscriptions}
                          setClickAction={setClickAction}
                          setOpenAlert={setOpenAlert}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', whiteSpace: 'nowrap' }} component="th" scope="row" align="right">
                        <Link style={{ color: 'var(--main-blue-sky)' }} to={`/profile/${row.user.profile_id}`}>{row.user.email}</Link>
                      </TableCell>
                      <TableCell sx={{ fontSize: '1.1rem', whiteSpace: 'nowrap' }} component="th" scope="row" align="right">
                        {row.user.full_name.length > 0 ? row.user.full_name : 'لايوجد إسم'}
                      </TableCell>
                      <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', whiteSpace: 'nowrap' }} component="th" scope="row" align="right">
                        <Link style={{ color: 'var(--main-blue-sky)' }} to={`/profile/${row.user.profile_id}`}>{row.user.profile_id}@</Link>
                      </TableCell>
                      <TableCell sx={{ fontSize: '1.1rem', whiteSpace: 'nowrap' }} align="right"><span>{row.course}</span></TableCell>
                      <TableCell sx={{ fontSize: '1.1rem', whiteSpace: 'nowrap' }} align="right"><span>{formatDate(row.created_dt)}</span></TableCell>
                      <TableCell sx={{ fontSize: '1.1rem', whiteSpace: 'nowrap' }} align="right">{
                        row.is_active ? <span className='bg-success px-4 text-white' style={{ borderRadius: '5px' }}>مفعل</span> : <span className='bg-secondary text-white px-4' style={{ borderRadius: '5px' }}>غير مفعل</span>
                      }</TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      sx={{ direction: 'ltr', fontSize: '1rem !important' }}
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      colSpan={10}
                      count={subscriptions.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      slotProps={{
                        select: {
                          inputProps: {
                            'aria-label': 'rows per page',
                          },
                          native: true,
                        },
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            :
            <NoVideos imgStyle={{ width: '200px' }} msg={searchQuery ? "لا يوجد مشتركين بهذه المعلومات" : "ل ايوجد  إشتراكات حتي الأن"} />
      }
      <div className='actions w-100 d-flex justify-content-end pt-4'>
        <Button component={Link} to='add' sx={{ fontWeight: 'bold' }} variant="outlined" startIcon={<AddIcon />}>
          إضافة إشتراك جديد
        </Button>
      </div>
      <Confirm
        open={openAlert}
        onConfirm={() => {
          clickAction.activations ? updateSubscription() : clickAction.delete && deleteSubscription();
          setOpenAlert(false);
        }}
        onClose={() => setOpenAlert(false)}
        title={clickAction.activations ? "حالة الإشتراك" : clickAction.delete && "حذف الإشتراك"}
        message={clickAction.activations ? "هل متأكد من تغيير حالة الإشتراك؟" : clickAction.delete && "هل متأكد من حذف الإشتراك؟"}
        cancelTitle="إلغاء"
        confirmTitle={clickAction.activations ? "نعم" : clickAction.delete && "نعم،حذف"}
      />
    </>

  );
}
