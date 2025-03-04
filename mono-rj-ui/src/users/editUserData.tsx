import React, {useEffect} from 'react';
import {Modal, Form, Input, Select} from 'antd';
import {IEditModalData} from './Users';
import {User} from "./UsersContainer";

const {Option} = Select;

const EditUserData = (props: IEditModalData) => {
    const {record, visible, onOk, onCancel, errorUsermessage} = props;
    const [form] = Form.useForm();

    // Populate form fields when modal is opened
    // useEffect(() => {
    //     if (record) {
    //         form.setFieldsValue(record);
    //         // form.resetFields();
    //     }
    // }, [record, form]);


    const handleSubmit = () => {
        form.validateFields()
            .then((values: User) => {
                if (record) {
                    values.id = record.id;
                }
                onOk(values); // Call parent handler with updated values
            })
            .catch((error) => {
                console.error("Validation Failed:", error);
            });
    };

    return (
        <Modal
            title="Edit User Data"
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
            okText="Save"
            cancelText="Cancel"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={record}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true, message: 'Please enter a username!'}]}>

                    <Input autoComplete='off'/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: 'Please enter a password!'}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{required: true, message: 'Please select a role!'}]}
                >
                    <Select>
                        <Option value="admin">Admin</Option>
                        <Option value="user">User</Option>
                    </Select>
                </Form.Item>
                <span style={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: 'red',
                    fontWeight: 'bold'
                }}>{props.errorUsermessage}</span>
            </Form>
        </Modal>
    );
};

export default EditUserData;
