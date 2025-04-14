import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../redux/services/orderAPI";
import { setOrders, setError, setStatus } from "../redux/slices/orderSlice";
import { useHistory } from "react-router-dom";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Container,
  Avatar,
  Alert,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography
} from "@mui/material";
import { ArrowLeft, CheckCircle, Truck, Package, Copy, RefreshCw } from "lucide-react";

const statusSteps = [
  { label: 'Ordered', icon: <Package size={16} />, color: '#3f51b5' },
  { label: 'Processing', icon: <RefreshCw size={16} />, color: '#ff9800' },
  { label: 'Shipped', icon: <Truck size={16} />, color: '#9c27b0' },
  { label: 'Out for Delivery', icon: <Truck size={16} />, color: '#673ab7' },
  { label: 'Delivered', icon: <CheckCircle size={16} />, color: '#4caf50' }
];

const statusMap = {
  placed: 0,
  processing: 1,
  shipped: 2,
  out_for_delivery: 3,
  delivered: 4
};

const StatusConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#4caf50',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#4caf50',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#eaeaf0',
    borderRadius: 1,
  },
}));

const StatusStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#303030' : '#eceff1',
  zIndex: 1,
  width: 28,
  height: 28,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    boxShadow: `0 0 0 4px ${ownerState.color}33`,
    backgroundColor: ownerState.color,
    color: theme.palette.common.white,
  }),
  ...(ownerState.completed && {
    backgroundColor: ownerState.color,
    color: theme.palette.common.white,
  }),
}));

function StatusStepIcon(props) {
  const { active, completed, index } = props;
  return (
    <StatusStepIconRoot
      ownerState={{
        active,
        completed,
        color: statusSteps[index].color
      }}
    >
      {statusSteps[index].icon}
    </StatusStepIconRoot>
  );
}

function StatusProgress({ status }) {
  const activeStep = statusMap[status.toLowerCase()] || 0;
  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Stepper
        nonLinear
        activeStep={activeStep}
        connector={<StatusConnector />}
      >
        {statusSteps.map((step, index) => (
          <Step key={step.label} completed={activeStep > index}>
            <StepLabel
              StepIconComponent={(props) => <StatusStepIcon {...props} index={index} />}
              sx={{
                '& .MuiStepLabel-label': {
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: activeStep >= index ? step.color : 'text.secondary',
                  lineHeight: 1.2
                }
              }}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const profile = useSelector((state) => state.user.profile) || {};
  const { _id: userId } = profile;
  const { orders = [], status, error } = useSelector((state) => state.order || {});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(setStatus("loading"));
        const data = await getOrders(userId);
        dispatch(setOrders(data));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };

    fetchOrders();
  }, [dispatch, userId]);

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    const idMatch = order._id.toLowerCase().includes(search);
    const productMatch = order.products?.some(p => p.name.toLowerCase().includes(search));
    return idMatch || productMatch;
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 1, sm: 2 } }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <IconButton
          onClick={() => history.push("/")}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          <ArrowLeft size={20} />
        </IconButton>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontSize: { xs: "0.5rem", sm: "1.5rem" }, fontWeight: 400 }}
        >
          Order History
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #ccc',
            width: '100%',
            maxWidth: 300,
            fontSize: '0.9rem'
          }}
        />
      </Box>

      {status === "loading" && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {status === "failed" && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {filteredOrders.length === 0 && status !== "loading" ? (
        <Alert severity="info">No matching orders found</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto', '& .MuiTable-root': { minWidth: 600 } }}>
          <Table sx={{ '& .MuiTableCell-root': { py: { xs: 1, sm: 2 }, px: { xs: 0.5, sm: 2 } } }}>
            <TableHead sx={{ '& .MuiTableRow-root .MuiTableCell-root': { fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' } }}>
              <TableRow>
                <TableCell sx={{ width: { xs: 80, sm: 120 } }}>Product</TableCell>
                <TableCell>Details</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Items</TableCell>
                <TableCell sx={{ minWidth: 300 }}>Progress</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={order.products?.[0]?.image}
                      sx={{
                        width: { xs: 48, sm: 64 },
                        height: { xs: 48, sm: 64 },
                        bgcolor: 'grey.100',
                        '& img': { objectFit: 'cover', transform: 'scale(0.9)' }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </Typography>
                      <Tooltip title="Copy Order ID">
                        <IconButton size="small" sx={{ p: 0.5 }}>
                          <Copy size={14} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                    <Typography variant="caption" sx={{
                      fontSize: { xs: '0.6rem', sm: '0.75rem' },
                      backgroundColor: order.paymentStatus === 'success' ? '#4CAF5020' :
                        order.paymentStatus === 'failed' ? '#f4433620' :
                          '#9E9E9E20',
                      mt: 0.5
                    }}>
                      Payment: {order.paymentMode}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', mt: 0.5 }}>
                      Expected Delivery: May 20, 2025
                    </Typography>
                    <Typography variant="caption" color="text.primary" sx={{
                      fontSize: { xs: '0.65rem', sm: '0.7rem' },
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 200,
                      mt: 0.5
                    }}
                      title={`${order.shippingAddress?.line1}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.postalCode}`}>
                      📦 {order.shippingAddress?.line1?.split(',')[0]}, {order.shippingAddress?.city}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    {order.products?.map((item, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, '&:not(:last-child)': { mb: 1 } }}>
                        <Typography variant="body2" noWrap sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">×{item.quantity}</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary', ml: 'auto', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          ${item.price?.toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'middle' }}>
                    <Box sx={{ transform: 'translateY(4px)' }}>
                      <StatusProgress status={order.orderStatus} />
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ verticalAlign: 'middle' }}>
                    <Typography variant="body1" sx={{
                      fontWeight: 700,
                      color: 'success.main',
                      fontFamily: 'monospace',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      whiteSpace: 'nowrap'
                    }}>
                      ${order.totalAmount?.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default OrderHistoryPage;
