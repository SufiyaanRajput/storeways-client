import { Modal, Alert, Form, Space } from "antd";
import { useEffect } from "react";
import { AddonBeforeInput } from '..';
import { loginCustomer } from 'themes/api';
import { useAsyncFetch } from 'themes/utils/hooks';
import Button from "@/base/Button/Button";
import { useForm } from 'antd/lib/form/Form';

  const LoginModal = ({ visible, user, setVisibility }) => {
    const [form] = useForm();
    const {
      isLoading,
      error,
      success,
      response,
      refetch,
    } = useAsyncFetch(false, loginCustomer);

    useEffect(() => {
      if (success) {
        user.setUser(response.data.user);
        setVisibility(false);
      }
    }, [response, setVisibility, success, user]);

    const onLogin = ({mobile}) => {
      refetch({mobile: `+91${mobile}`});
    }

    return(
      <Modal title="Login" 
        visible={visible}
        closable={true}
        onCancel={() => setVisibility(false)}
        footer={[
          <Button key="back" size='small' onClick={() => setVisibility(false)}>
            Cancel
          </Button>,
          <Button key="submit" size='small' type="primary" loading={isLoading} onClick={form.submit}>
            Login
          </Button>
        ]}>
         <Form
            form={form}
            name="basic"
            layout="vertical"
            wrapperCol={{ span: 24 }}
            onFinish={onLogin}
            validateTrigger="onBlur"
            autoComplete="off">
              <Form.Item
                name="mobile"
                label="Mobile"
                rules={[{ required: true, message: 'Please input your mobile number!' }, {
                  pattern: '^(9|8|7)[0-9]{9}$',
                  message: `Doesn't seem like a mobile number`
                }]}
              >
                <AddonBeforeInput addonBefore="+91" style={{ width: '100%' }} />
            </Form.Item>
          </Form>
          {
            error &&
            <Space direction='vertical'>
              <Alert message="Account not found! Your account is auto created when you first checkout." type="error" />
            </Space>
          }
      </Modal>
    );
  }

  export default LoginModal;