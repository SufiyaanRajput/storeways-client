import { Section, Container } from "@/base/index";
import { SectionTitle } from "@/base/Section/Section";
import { Table, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { useAsyncFetch } from "themes/utils/hooks";
import { cancelOrders, fetchOrders } from "./api";

const Orders = () => {
  const [cancellingId, setCancellingId] = useState(null);

  const {
    isLoading: fetchingOrders,
    success: fetchingOrdersSuccess,
    response: fetchOrdersResponse,
    refetch: refetchOrders
  } = useAsyncFetch(true, fetchOrders);

  const {
    isLoading: cancellingOrders,
    success: cancellingOrdersSuccess,
    refetch: recancelOrders
  } = useAsyncFetch(false, cancelOrders);

  useEffect(() => {
    if (cancellingOrdersSuccess) {
      setCancellingId(null);
      refetchOrders();
    }
  }, [cancellingOrdersSuccess, refetchOrders]);

  const onCancelOrder = (record) => {
    Modal.confirm({
      title: 'Are you sure?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setCancellingId(record.id);
        recancelOrders({ids: [record.id], products: [{quantity: record.quantity, id: record.productId}]});
      },
      onCancel() {},
    });
  }

  const columns = [
    {
      title: 'Reference ID',
      dataIndex: 'referenceId',
      key: 'referenceId',
      width: 170,
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (text, record) => {
        return(<p>₹{text}</p>);
      },
    },
    {
      title: 'Order date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (text, record) => {
        return new Date(record.createdAt).toLocaleDateString();
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      fixed: 'right',
      width: 100,
      key: 'x',
      render: (text, record) => {
        if (record.status === 'Cancelled') return <p className="danger">Cancelled</p>;
        return(<Button loading={cancellingId === record.id} onClick={() => onCancelOrder(record)} danger>Cancel</Button>);
      },
    },
  ];

  const makeOrders = () => {
    if (fetchingOrdersSuccess) {
      return fetchOrdersResponse.data.orders;
    }

    return [];
  }

  return(
    <main>
      <Section>
        <Container $maxWidth="1300px">
          <SectionTitle orientation="left"><h4>Your orders</h4></SectionTitle>
          <Table dataSource={makeOrders()} scroll={{ x: 1100 }} columns={columns} loading={fetchingOrders} />
        </Container>
      </Section>
    </main>
  );
}

export default Orders;