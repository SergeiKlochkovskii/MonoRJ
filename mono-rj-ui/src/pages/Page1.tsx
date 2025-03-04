import React from 'react';
import {Button, Input} from 'antd';


const {TextArea} = Input;

interface IProps {
    setMenuKeyItem: (menuKeyItem: string) => void,
}

const Page1 = (props: IProps) => {

    return (
        <div className={'container'} style={{flexGrow: 1, width: '100%'}}>
            <div className={'sub-container-2'}>
                <div style={{display: 'flex', flexGrow: 50}}>

                    <TextArea value={''}
                              style={{resize: 'none'}}
                        //onPaste={handlePaste}
                              spellCheck={false}
                        // onChange={handleInputChange}
                              className={'test-text-area'}
                              rows={20} placeholder='Add or remove the placeholder text'/>
                </div>
                <div className={'test-btn-area'}>
                    <Button
                        className={'test-btn'}
                        // disabled={}
                        // onClick={}
                        type='primary'> Button 1</Button>
                    <Button
                        className={'test-btn'}
                        //disabled={!execEnabled}
                        // onClick={}
                        type='primary'> Button 2</Button>
                    <Button
                        className={'test-btn'}
                        // disabled={}
                        // onClick={}
                        type='primary'> Button 3</Button>
                </div>
                <div style={{display: 'flex', flexGrow: 50}}>
                    <TextArea
                        spellCheck={false}
                        style={{resize: 'none'}}
                        value={''}
                        // onChange={handleResultChange}
                        className={'test-text-area'}
                        rows={20} placeholder='Add or remove the placeholder text'/>
                </div>
            </div>
        </div>
    );
};

export default Page1;