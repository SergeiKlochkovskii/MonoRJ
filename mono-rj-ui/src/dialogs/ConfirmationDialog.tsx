import React from 'react';
import { Button, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './Dialogs.scss';
import {IconDefinition} from '@fortawesome/free-regular-svg-icons';

interface IProps {
    title?: string;
    closeable?: boolean;
    visible?: boolean;
    content: () => JSX.Element;
    confirm(): void;
    cancel(): void;
    width?: number;
    dialogIcon?: {iconName: IconDefinition, iconColor: string};
    buttonText?: string;
}

const ConfirmationDialog = (props: IProps) => {

    const defaultWidth = 320;

    return (
        <>
            <Modal
                style={{top: 40}}
                title={props.title}
                open={props.visible}
                footer={null}
                width={typeof props.width === 'undefined' ? defaultWidth : props.width}
                closable={typeof props.closeable === 'undefined' ? false : props.closeable}
                destroyOnClose
                onCancel={props.confirm}
            >
                <div className='dialog-confirmation'>
                    <div className='dialog-confirmation-logo'><FontAwesomeIcon
                        icon={typeof props.dialogIcon === 'undefined' ? faCheckCircle : props.dialogIcon.iconName}
                        style={{
                            color: typeof props.dialogIcon === 'undefined' ? 'yellowGreen' : props.dialogIcon.iconColor,
                            fontSize: '3rem'
                        }}/></div>
                    <div className='dialog-confirmation-text'>
                        {props.content()}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Button
                            type='primary' onClick={props.cancel} className={'dialog-confirmation-button'}>
                            Cancel
                        </Button>
                        <Button type='primary'  className={'dialog-cancel-button'}
                                onClick={props.confirm}>
                            Ok
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );

}
export default ConfirmationDialog;