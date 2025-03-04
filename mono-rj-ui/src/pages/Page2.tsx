import React from 'react';
import TextArea from 'antd/es/input/TextArea';
import {Button, Input, Space} from 'antd';

interface IProps {
    setMenuKeyItem: (menuKeyItem: string) => void,
}

const Page2 = (props: IProps) => {

    return (
        <div className={'container'} style={{flexGrow: 1, width: '100%'}}>
            <div className={'container-hor'}>
                <div className={'child'}>
                    <TextArea
                        spellCheck={false}
                        style={{resize: 'none'}}
                        value={'inputText'}
                        // onChange={handleInputChange}
                        className={'test-text-area'}
                        rows={7} placeholder='Copia un buffer de Tuxedo aquí'/>
                </div>

                <div className={'test-btn-area-hor'}>
                    <Button
                        className={'test-btn-hor'}
                        // disabled={}
                        // onClick={}
                        type='primary'> Button 1 </Button>
                    <Button
                        className={'test-btn-hor'}
                        // disabled={}
                        // onClick={}
                        type='primary'> Button 2 </Button>

                    <Space.Compact className={'space-conf'}>
                        <Input style={{width: '3rem'}} defaultValue="10"
                               maxLength={2}
                            // onChange={}
                            // value={}
                        />
                        <Button
                            className={'conf-test-btn'}
                            // onClick={}
                            // disabled={takeBuffer}
                            // loading={}
                            type='primary'> Button 3</Button>
                    </Space.Compact>

                    <Space.Compact>
                        <Input style={{width: '3rem'}} defaultValue="10"
                               maxLength={2}
                            // onChange={}
                            // value={}
                        />

                        <Button
                            className={'conf-test-btn'}
                            // onClick={}
                            // disabled={}
                            // loading={}
                            type='primary'> Button 4</Button>
                    </Space.Compact>

                </div>
                <div className={'child'} style={{display: 'flex'}}>
                    <TextArea
                        spellCheck={false}
                        style={{resize: 'none'}}
                        value={'OutputResult'}
                        // onChange={}
                        className={'test-text-area'}
                        rows={20} placeholder='Resultado'/>
                </div>
            </div>
        </div>
    );

};

export default Page2;
