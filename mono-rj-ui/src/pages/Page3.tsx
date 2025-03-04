import React from 'react';
import {Button} from 'antd';

interface IProps {
}

const Page3 = (props: IProps) => {

    return (
        <div className={'service-explorer'}>
            <div style={{
                display: 'flex', flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
            }}>
                <Button
                    className={'test-btn-hor'}
                    // onClick={}
                    type='primary'>Click! (Nothing happens)</Button>
            </div>
        </div>
    );
};
export default Page3;