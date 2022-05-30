import { Section, Container } from "@/base/index";
import { SectionTitle } from "@/base/Section/Section";
import { Table, Button, Modal, notification, Tag } from "antd";
import { useEffect, useState } from "react";
import { useAsyncFetch } from "themes/utils/hooks";
import { cancelOrders, fetchOrders } from "./api";

const ProductTable = ({ record, refetchOrders }) => {
  const [cancellingId, setCancellingId] = useState(null);

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
      okButtonProps: {loading: cancellingOrders},
      onOk() {
        setCancellingId(record.id);
        recancelOrders({referenceIds: [record.referenceId], products: [{quantity: record.quantity, id: record.productId}]});
      },
      onCancel() {},
    });
  }

  const columns = [
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Reference ID', dataIndex: 'referenceId', key: 'referenceId' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Variations',
      key: 'variations',
      render: (text, record) => (
        record.variations.map((variant, i) => (
          <Tag key={i}>{variant.variationName}: {variant.option}</Tag>
        ))
      ),
    },
    {
      title: 'Action',
      dataIndex: '',
      fixed: 'right',
      width: 100,
      key: 'x',
      render: (text, record) => {
        if (record.status === 'Cancelled') return <p className="danger">Cancelled</p>;
        return(<Button loading={cancellingId === record.id && cancellingOrders} onClick={() => onCancelOrder(record)} danger>Cancel</Button>);
      },
    },
  ];
  
  return <Table columns={columns} dataSource={record} pagination={false} />;
};

const Orders = () => {
  const {
    isLoading: fetchingOrders,
    success: fetchingOrdersSuccess,
    error: fetchOrdersError,
    response: fetchOrdersResponse,
    refetch: refetchOrders
  } = useAsyncFetch(true, fetchOrders);

  useEffect(() => {
    if (fetchOrdersError) {
      notification.error({
        message: `Something went wrong!`,
        placement: 'bottomRight'
      })
    }
  }, [fetchOrdersError]);

  const columns = [
    {
      title: 'Cart reference ID',
      dataIndex: 'cartReferenceId',
      key: 'cartReferenceId',
      width: 170,
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
      title: 'Total items',
      dataIndex: 'totalItems',
      key: 'totalItems',
      width: 150,
      render: (text, record) => {
        return(<p>{record.items.length}</p>);
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
  ];

  const makeOrders = () => {
    if (fetchingOrdersSuccess) {
      return fetchOrdersResponse.data.orders.map(o => ({...o, key: o.id}));
    }

    return [];
  }

  return(
    <main>
      <Section>
        <Container $maxWidth="1300px">
          <SectionTitle orientation="left"><h4>Your orders</h4></SectionTitle>
          <Table dataSource={makeOrders()} rowKey="cartReferenceId" scroll={{ x: 1100 }} columns={columns} loading={fetchingOrders} expandable={{
            expandedRowRender: (record) => <ProductTable record={record.items} refetchOrders={refetchOrders}/>
          }}/>
        </Container>
      </Section>
    </main>
  );
}

export default Orders;