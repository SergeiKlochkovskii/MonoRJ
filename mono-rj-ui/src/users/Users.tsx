import {Button, Space, Table, Tooltip} from "antd";
import {User, UsersContainerState} from "./UsersContainer";
import {AlignType} from 'rc-table/lib/interface';
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useState} from "react";

import {stateItem} from '../dialogs/dialogSharedData';
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import EditUserData from "./editUserData";

export interface IEditModalData {
    record: User,
    visible: boolean,
    onOk: (values: User) => void,
    onCancel: () => void,
    errorUsermessage: string,
}


const Users = (props: UsersContainerState) => {
    const [dialogState, setDialogState] = useState<{
        visible: boolean; currentState: stateItem; nextState: stateItem; dialogMessage: string;
    }>({visible: false, currentState: {}, nextState: {}, dialogMessage: ''});

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<User | null>(null);


    const handleEdit = (record: User) => {
        setSelectedRecord(record);
        setModalVisible(true);
    };

    const handleSave = (updatedRecord: User) => {
        //console.log("Updated user:", updatedRecord);
        setModalVisible(false);
        //props.fetchUsers(props.pageNumber - 1, props.pageSize);
        if (updatedRecord.id) {
            props.updateUserAndFetchUsers(updatedRecord, props.pageNumber - 1, props.pageSize);

        } else {
            props.addUserAndFetchUsers(updatedRecord, props.pageNumber - 1, props.pageSize);
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const dropUserData = (record: User) => {
        setSelectedRecord(record)
        setDialogState({
            visible: true,
            currentState: {stateId: 1, stateName: 'Initial State', color: '#ff0000'},
            nextState: {stateId: 2, stateName: 'Next State', color: '#00ff00'},
            dialogMessage: `¿Eliminate el usuario ${record.username}?`
        });
    }


    const actionRenderer = (record: User) => {
        return (
            <Space size='small'>
                <Tooltip title={'Editar usuario'}>
                    <Button type='primary' icon={<EditOutlined/>} onClick={() => handleEdit(record)}/>
                </Tooltip>
                <Tooltip title={'Eliminar usuario'}>
                    <Button type='primary' icon={<DeleteOutlined/>} style={{background: 'red'}}
                            onClick={() => dropUserData(record)}/>
                </Tooltip>
            </Space>
        );
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nombre de usuario',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Contraseña',
            dataIndex: 'password',
            key: 'password',
            // Render a fixed asterisk string instead of the actual password
            render: () => '*****',
        },
        {
            title: 'Rol',
            dataIndex: 'role',
            key: 'role',
        },
        {align: 'right' as AlignType, width: '8rem', render: actionRenderer}
    ];

    const operadorContent = () => {
        return (
            <div style={{textAlign: 'center'}}>
                {dialogState.dialogMessage}
            </div>
        );
    }

    const deleteUserConfirmation = () => {
        setDialogState({...dialogState, visible: false});
        props.deleteUserAndFetchUsers(selectedRecord!, props.pageNumber - 1, props.pageSize);
    }

    const operadorCancel = () => {
        setDialogState({...dialogState, visible: false});
    }

    const handlePageChange = (page: number, pageSize: number) => {
        props.fetchUsers(page - 1, pageSize);
    }

    const addUser = () => {
        const record: User = {username: 'Nuevo', role: 'user', password: ''};
        setSelectedRecord(record);
        setModalVisible(true);
    }

    return (

        <div style={{display: 'flex', justifyContent: 'top', flexDirection: 'column', height: '100%', width: '100%'}}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Table
                    size={'small'}
                    tableLayout={'fixed'}
                    style={{width: '50%'}}
                    columns={columns}
                    dataSource={props ? props.users : []}
                    loading={props ? props.loading : undefined}
                    rowKey="id"
                    pagination={{
                        position: ['bottomCenter'],
                        hideOnSinglePage: false,
                        showSizeChanger: false,
                        current: props ? (props.pageNumber === 0 ? 1 : props.pageNumber) : 1,
                        pageSize: props ? props.pageSize : 7,
                        total: props?.totalCount,
                        onChange: handlePageChange
                    }}

                />
                <ConfirmationDialog
                    width={400}
                    visible={dialogState.visible}
                    confirm={deleteUserConfirmation}
                    cancel={operadorCancel}
                    content={operadorContent}
                    closeable={true}
                    buttonText={dialogState.nextState.stateName}
                    dialogIcon={{iconName: faQuestionCircle, iconColor: 'red'}}
                />
                {modalVisible ?
                    <EditUserData
                        record={selectedRecord!}
                        visible={modalVisible}
                        onOk={handleSave}
                        onCancel={handleCancel}
                        errorUsermessage={props.errorUsermessage}
                    />
                    : null}
            </div>
            <div
                style={{display: 'flex', justifyContent: 'center'}}>

                <Button type={'primary'} className={'test-btn'} onClick={addUser}>
                    Nuevo usuario
                </Button>
            </div>
        </div>
    );

};

export default Users;