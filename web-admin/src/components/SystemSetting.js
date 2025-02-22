import React, {useEffect, useState} from 'react';

import { Button,Form,Select,  Typography, Divider, Tooltip, Spin, Layout,TextArea,Input,Checkbox,Modal,Card,TagInput } from '@douyinfe/semi-ui';

import {API, removeTrailingSlash, showError, verifyJSON} from '../helpers';

const SystemSetting = () => {
    let [inputs, setInputs] = useState({
        PasswordLoginEnabled: '',
        PasswordRegisterEnabled: '',
        EmailVerificationEnabled: '',
        GitHubOAuthEnabled: '',
        GitHubClientId: '',
        GitHubClientSecret: '',
        Notice: '',
        SMTPServer: '',
        SMTPPort: '',
        SMTPAccount: '',
        SMTPFrom: '',
        SMTPToken: '',
        ServerAddress: '',
        Footer: '',
        WeChatAuthEnabled: '',
        WeChatServerAddress: '',
        WeChatServerToken: '',
        WeChatAccountQRCodeImageURL: '',
        TurnstileCheckEnabled: '',
        TurnstileSiteKey: '',
        TurnstileSecretKey: '',
        RegisterEnabled: '',
        EmailDomainRestrictionEnabled: '',
        EmailDomainWhitelist: '',
        EmailNotificationsEnabled: '',
        WxPusherNotificationsEnabled: '',
        UserGroup:'',
        VipUserGroup:'',
        GroupEnable:''

    });
    const [originInputs, setOriginInputs] = useState({});
    let [loading, setLoading] = useState(false);
    const [EmailDomainWhitelist, setEmailDomainWhitelist] = useState([]);
    const [restrictedDomainInput, setRestrictedDomainInput] = useState('');
    const [showPasswordWarningModal, setShowPasswordWarningModal] = useState(false);
    const [groupOptions, setGroupOptions] = useState([]);
    const { Text } = Typography;
    const getOptions = async () => {
        const res = await API.get('/api/option/');
        const {success, message, data} = res.data;
        if (success) {
            let newInputs = {};
            data.forEach((item) => {
                newInputs[item.key] = item.value;
            });
            setInputs({
                ...newInputs,
                EmailDomainWhitelist: newInputs.EmailDomainWhitelist.split(',')
            });
            setOriginInputs(newInputs);
            setEmailDomainWhitelist(newInputs.EmailDomainWhitelist.split(',').map((item) => {
                return {key: item, text: item, value: item};
            }));
        } else {
            showError(message);
        }
    };

    useEffect(() => {
        getOptions();
        fetchGroups();
    }, []);


    const updateOption = async (key, value) => {
        setLoading(true);
        const res = await API.put('/api/option/', {
          key,
          value
        });
        const { success, message } = res.data;
        if (success) {
          setInputs((inputs) => ({ ...inputs, [key]: value }));
        } else {
          showError(message);
        }
        setLoading(false);
    };

    const fetchGroups = async () => {
    try {
      let res = await API.get(`/api/group/`);
      setGroupOptions(res.data.data.map((group) => ({
        label: group,
        value: group,
      })));
    } catch (error) {
      showError(error.message);
    }
  };
    

    const handleInputChange = (name, value) => {
        setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    };

    const handleCheckboxChange = (name, checked) => {
        setInputs((prevInputs) => ({ ...prevInputs, [name]: checked ? 'true' : 'false' }));
    };
    

    const submitServerAddress = async () => {
        let ServerAddress = removeTrailingSlash(inputs.ServerAddress);
        await updateOption('ServerAddress', ServerAddress);
        setOriginInputs(inputs);
    };

    const submitRegister = async () => {
        await updateOption('PasswordRegisterEnabled', inputs.PasswordRegisterEnabled);
        await updateOption('EmailVerificationEnabled', inputs.EmailVerificationEnabled);
        await updateOption('GitHubOAuthEnabled', inputs.GitHubOAuthEnabled);
        await updateOption('WeChatAuthEnabled', inputs.WeChatAuthEnabled);
        await updateOption('RegisterEnabled', inputs.RegisterEnabled);
        await updateOption('TurnstileCheckEnabled', inputs.TurnstileCheckEnabled);
        await updateOption('GroupEnable', inputs.GroupEnable);
    };

    const submitSMTP = async () => {
        if (originInputs['SMTPServer'] !== inputs.SMTPServer) {
            await updateOption('SMTPServer', inputs.SMTPServer);
        }
        if (originInputs['SMTPAccount'] !== inputs.SMTPAccount) {
            await updateOption('SMTPAccount', inputs.SMTPAccount);
        }
        if (originInputs['SMTPFrom'] !== inputs.SMTPFrom) {
            await updateOption('SMTPFrom', inputs.SMTPFrom);
        }
        if (
            originInputs['SMTPPort'] !== inputs.SMTPPort &&
            inputs.SMTPPort !== ''
        ) {
            await updateOption('SMTPPort', inputs.SMTPPort);
        }
        if (
            originInputs['SMTPToken'] !== inputs.SMTPToken &&
            inputs.SMTPToken !== ''
        ) {
            await updateOption('SMTPToken', inputs.SMTPToken);
        }
        setOriginInputs(inputs);
    };

    const wxPusher = async () => {
        // 更新 AppToken 设置
        if (originInputs['AppToken'] !== inputs.AppToken) {
            await updateOption('AppToken', inputs.AppToken);
        }
        // 更新 Uids 设置
        if (originInputs['Uids'] !== inputs.Uids) {
            await updateOption('Uids', inputs.Uids);
        }
        // 更新 邮箱
        if (originInputs['NotificationEmail'] !== inputs.NotificationEmail) {
            await updateOption('NotificationEmail', inputs.NotificationEmail);
        }
        await updateOption('EmailNotificationsEnabled', inputs.EmailNotificationsEnabled);
        await updateOption('WxPusherNotificationsEnabled', inputs.WxPusherNotificationsEnabled);
        setOriginInputs(inputs);
    };
    
    const handleTagInputChange = (value) => {
        setInputs((prevInputs) => ({ ...prevInputs, EmailDomainWhitelist: value }));
    };

    const submitEmailDomainWhitelist = async () => {
        await updateOption('EmailDomainRestrictionEnabled', inputs.EmailDomainRestrictionEnabled);
        if (
            originInputs['EmailDomainWhitelist'] !== inputs.EmailDomainWhitelist.join(',') &&
            inputs.SMTPToken !== ''
        ) {
            await updateOption('EmailDomainWhitelist', inputs.EmailDomainWhitelist.join(','));
        }
        setOriginInputs(inputs);
    };

    const submitWeChat = async () => {
        if (originInputs['WeChatServerAddress'] !== inputs.WeChatServerAddress) {
            await updateOption(
                'WeChatServerAddress',
                removeTrailingSlash(inputs.WeChatServerAddress)
            );
        }
        if (
            originInputs['WeChatAccountQRCodeImageURL'] !==
            inputs.WeChatAccountQRCodeImageURL
        ) {
            await updateOption(
                'WeChatAccountQRCodeImageURL',
                inputs.WeChatAccountQRCodeImageURL
            );
        }
        if (
            originInputs['WeChatServerToken'] !== inputs.WeChatServerToken &&
            inputs.WeChatServerToken !== ''
        ) {
            await updateOption('WeChatServerToken', inputs.WeChatServerToken);
        }
        setOriginInputs(inputs);
    };

    const submitGitHubOAuth = async () => {
        if (originInputs['GitHubClientId'] !== inputs.GitHubClientId) {
            await updateOption('GitHubClientId', inputs.GitHubClientId);
        }
        if (
            originInputs['GitHubClientSecret'] !== inputs.GitHubClientSecret &&
            inputs.GitHubClientSecret !== ''
        ) {
            await updateOption('GitHubClientSecret', inputs.GitHubClientSecret);
        }
        setOriginInputs(inputs);
    };

    const submitTurnstile = async () => {
        if (originInputs['TurnstileSiteKey'] !== inputs.TurnstileSiteKey) {
            await updateOption('TurnstileSiteKey', inputs.TurnstileSiteKey);
        }
        if (
            originInputs['TurnstileSecretKey'] !== inputs.TurnstileSecretKey &&
            inputs.TurnstileSecretKey !== ''
        ) {
            await updateOption('TurnstileSecretKey', inputs.TurnstileSecretKey);
        }
        setOriginInputs(inputs);
    };

    const submitNewRestrictedDomain = () => {
        const localDomainList = inputs.EmailDomainWhitelist;
        if (restrictedDomainInput !== '' && !localDomainList.includes(restrictedDomainInput)) {
            setRestrictedDomainInput('');
            setInputs({
                ...inputs,
                EmailDomainWhitelist: [...localDomainList, restrictedDomainInput],
            });
            setEmailDomainWhitelist([...EmailDomainWhitelist, {
                key: restrictedDomainInput,
                text: restrictedDomainInput,
                value: restrictedDomainInput,
            }]);
        }
        setOriginInputs(inputs);
    }

    return (
        <Spin spinning={loading}>
            <Layout style={{ padding: '24px' }}>
                <Typography.Title style={{ marginBottom: '10px'}} heading={5}>通用设置</Typography.Title>
                    <Form >
                        <div style={{ width: '70%', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ width: '40%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>服务器地址</Typography.Text>
                                </div>
                                <Input
                                placeholder='例如：https://yourdomain.com'
                                value={inputs.ServerAddress}
                                name='ServerAddress'
                                onChange={(value) => handleInputChange('ServerAddress', value)}
                                />
                            </div>
                        </div>
                        <Button onClick={submitServerAddress} style={{ marginTop: '3px' }}>更新服务器地址</Button>
                    </Form>
                    <Divider style={{ marginTop: '20px' , marginBottom: '10px' }}/>
                    <Form >
                    <Typography.Title style={{ marginBottom: '10px'}} heading={5}>配置登录注册</Typography.Title>
                    <div style={{
                            display: 'flex', 
                            alignItems: 'center',
                            marginBottom: '20px',
                            gap: '10px' // 控制内部元素的空间
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Checkbox
                                    checked={inputs.PasswordRegisterEnabled === 'true'}
                                    name='PasswordRegisterEnabled'
                                    onChange={(e) => handleCheckboxChange('PasswordRegisterEnabled', e.target.checked)}
                                />
                                <Typography.Text>允许通过密码进行注册</Typography.Text>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Checkbox
                                    checked={inputs.EmailVerificationEnabled === 'true'}
                                    name='EmailVerificationEnabled'
                                    onChange={(e) => handleCheckboxChange('EmailVerificationEnabled', e.target.checked)}
                                />
                                <Typography.Text>通过密码注册时需要进行邮箱验证</Typography.Text>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                
                                <Checkbox
                                    checked={inputs.GitHubOAuthEnabled === 'true'}
                                    name='GitHubOAuthEnabled'
                                    onChange={(e) => handleCheckboxChange('GitHubOAuthEnabled', e.target.checked)}
                                />
                                <Typography.Text>允许通过 GitHub 账户登录 & 注册</Typography.Text>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Checkbox
                                    checked={inputs.WeChatAuthEnabled === 'true'}
                                    name='WeChatAuthEnabled'
                                    onChange={(e) => handleCheckboxChange('WeChatAuthEnabled', e.target.checked)}
                                />
                                <Typography.Text>允许通过微信登录 & 注册</Typography.Text>
                            </div>
                        </div>
                        <div style={{
                            display: 'flex', 
                            alignItems: 'center',
                            marginBottom: '20px',
                            gap: '10px' // 控制内部元素的空间
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Checkbox
                                    checked={inputs.RegisterEnabled === 'true'}
                                    name='RegisterEnabled'
                                    onChange={(e) => handleCheckboxChange('RegisterEnabled', e.target.checked)}
                                />
                                <Typography.Text>允许新用户注册（此项为否时，新用户将无法以任何方式进行注册）</Typography.Text>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Checkbox
                                    checked={inputs.TurnstileCheckEnabled === 'true'}
                                    name='TurnstileCheckEnabled'
                                    onChange={(e) => handleCheckboxChange('TurnstileCheckEnabled', e.target.checked)}
                                />
                                <Typography.Text>启用 Turnstile 用户校验</Typography.Text>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Checkbox
                                        checked={inputs.GroupEnable === 'true'}
                                        name='GroupEnable'
                                        onChange={(e) => handleCheckboxChange('GroupEnable', e.target.checked)}
                                    />
                                    <Typography.Text>启用默认分组</Typography.Text>
                            </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            
                            <div style={{ flex: 1, marginRight: 5 }}>
                                
                                <Typography.Text>新注册用户默认分组 </Typography.Text>
                                <Select
                                placeholder={'请选择分组'}
                                name='UserGroup'
                                fluid
                                search
                                selection
                                allowAdditions
                                additionLabel={'请在系统设置页面编辑分组倍率以添加新的分组：'}
                                onChange={async (value) => {
                                    await updateOption('UserGroup', value);
                                }}
                                value={inputs.UserGroup}
                                autoComplete='new-password'
                                optionList={groupOptions}
                                />
                            </div>
                            <div style={{ flex: 5, marginLeft: 5 }}>
                                <Typography.Text>充值用户默认分组 </Typography.Text>
                                <Select
                                placeholder={'请选择分组'}
                                name='VipUserGroup'
                                fluid
                                search
                                selection
                                allowAdditions
                                additionLabel={'请在系统设置页面编辑分组倍率以添加新的分组：'}
                                onChange={async (value) => {
                                    // 直接调用 updateOption 函数进行提交
                                    await updateOption('VipUserGroup', value);
                                }}
                                value={inputs.VipUserGroup}
                                autoComplete='new-password'
                                optionList={groupOptions}
                                />
                            </div>
                        </div>
                        <Button onClick={submitRegister} style={{ marginTop: '3px' }}>保存注册登录设置</Button>
                    </Form>
                    <Divider style={{ marginTop: '20px' , marginBottom: '10px' }}/>
                    <Typography.Title style={{ marginBottom: '10px'}} heading={5}>配置WxPusher消息推送</Typography.Title>
                    <Form >
                        <div style={{ width: '70%', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ width: '40%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>应用的AppToken</Typography.Text>
                                </div>
                                <Input
                                placeholder='应用的AppToken'
                                value={inputs.AppToken}
                                name='AppToken'
                                onChange={(value) => handleInputChange('AppToken', value)}
                                />
                            </div>
                            <div style={{ width: '40%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>用户的 Uid</Typography.Text>
                                </div>
                                <Input
                                placeholder='用户的 Uid'
                                value={inputs.Uids}
                                name='Uids'
                                onChange={(value) => handleInputChange('Uids', value)}
                                />
                            </div>
                            <div style={{ width: '20%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>通知邮箱</Typography.Text>
                                </div>
                                <Input
                                placeholder='通知邮箱'
                                value={inputs.NotificationEmail}
                                name='NotificationEmail'
                                onChange={(value) => handleInputChange('NotificationEmail', value)}
                                />
                            </div>
                            
                        </div>
                        <div style={{
                            display: 'flex', 
                            alignItems: 'center',
                            marginBottom: '20px',
                            gap: '10px' // 控制内部元素的空间
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Typography.Text>启用电子邮件通知</Typography.Text>
                                <Checkbox
                                    checked={inputs.EmailNotificationsEnabled === 'true'}
                                    name='EmailNotificationsEnabled'
                                    onChange={(e) => handleCheckboxChange('EmailNotificationsEnabled', e.target.checked)}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Typography.Text>启用WxPusher通知</Typography.Text>
                                <Checkbox
                                    checked={inputs.WxPusherNotificationsEnabled === 'true'}
                                    name='WxPusherNotificationsEnabled'
                                    onChange={(e) => handleCheckboxChange('WxPusherNotificationsEnabled', e.target.checked)}
                                />
                            </div>
                        </div>
                        <Button onClick={wxPusher} style={{ marginTop: '3px' }}>保存 WxPusher 设置</Button>
                    </Form>
                    <Divider style={{ marginTop: '20px', marginBottom: '10px' }}/>
                    <Form >
                        <Typography.Title style={{ marginBottom: '10px'}} heading={5}>配置邮箱域名白名单</Typography.Title>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Typography.Text>启用邮箱域名白名单</Typography.Text>
                            <Checkbox
                                checked={inputs.EmailDomainRestrictionEnabled === 'true'}
                                name='EmailDomainRestrictionEnabled'
                                onChange={(e) => handleCheckboxChange('EmailDomainRestrictionEnabled', e.target.checked)}
                            />
                        </div>
                        <div style={{marginTop: 20}}>
                            <Typography.Text>允许的邮箱域名（输入回车即可）</Typography.Text>
                        </div>
                        <div style={{marginTop: 20}}>
                        <TagInput 
                        style={{width: '50%',  marginBottom: '10px'}} heading={5}
                            placeholder='允许的邮箱域名'
                            name='EmailDomainWhitelist'
                            value={inputs.EmailDomainWhitelist}
                            onChange={handleTagInputChange}
                            addOnBlur
                            autoComplete='new-password'
                        />
                        </div>
                        <Button onClick={submitEmailDomainWhitelist} style={{ marginTop: '3px' }}>保存邮箱域名白名单设置</Button>
                    </Form>
                    <Divider style={{ marginTop: '20px', marginBottom: '10px'  }}/>
                    
                    <Form widths={3}>
                    <Typography.Title style={{ marginBottom: '10px'}} heading={5}>配置 SMTP</Typography.Title>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ width: '30%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>SMTP 服务器地址</Typography.Text>
                                </div>
                                <Input
                                placeholder='例如：smtp.qq.com'
                                value={inputs.SMTPServer}
                                name='SMTPServer'
                                onChange={(value) => handleInputChange('SMTPServer', value)}
                                />
                            </div>
                            <div style={{ width: '30%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>SMTP 端口</Typography.Text>
                                </div>
                                <Input
                                placeholder='默认: 465'
                                value={inputs.SMTPPort}
                                name='SMTPPort'
                                onChange={(value) => handleInputChange('SMTPPort', value)}
                                />
                            </div>
                            <div style={{ width: '30%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>SMTP 账户</Typography.Text>
                                </div>
                                <Input
                                placeholder='通常是邮箱地址'
                                value={inputs.SMTPAccount}
                                name='SMTPAccount'
                                onChange={(value) => handleInputChange('SMTPAccount', value)}
                                />
                            </div>
                            <div style={{ width: '30%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>SMTP 发送者邮箱</Typography.Text>
                                </div>
                                <Input
                                placeholder='通常和邮箱地址保持一致'
                                value={inputs.SMTPFrom}
                                name='SMTPFrom'
                                onChange={(value) => handleInputChange('SMTPFrom', value)}
                                />
                            </div>
                            <div style={{ width: '30%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>SMTP 访问凭证</Typography.Text>
                                </div>
                                <Input
                                placeholder='敏感信息不会发送到前端显示'
                                value={inputs.SMTPToken}
                                name='SMTPToken'
                                onChange={(value) => handleInputChange('SMTPToken', value)}
                                />
                            </div>  
                        </div>
                        <Button onClick={submitSMTP} style={{ marginTop: '3px' }}>保存 SMTP 设置</Button>
                    </Form>

                    <Divider style={{ marginTop: '20px' , marginBottom: '10px' }}/>
                <Form widths={3}>
                    <Typography.Title style={{ marginBottom: '10px'}} heading={5}>配置 GitHub OAuth App</Typography.Title>
                    <Text style={{ marginBottom: '10px'}} heading={9}>
                        用以支持通过 GitHub 进行登录注册，
                            <a href='https://github.com/settings/developers' target='_blank'>
                                点击此处
                            </a>
                            管理你的 GitHub OAuth App</Text>
                            <Card 
                            style={{ maxWidth: '60%' }}
                        >
                            Homepage URL 填 <code>{inputs.ServerAddress}</code>
                            ，Authorization callback URL 填{' '}
                            <code>{`${inputs.ServerAddress}/oauth/github`}</code>        
                        </Card>
                        <div style={{width: '60%', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ width: '50%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>GitHub Client ID</Typography.Text>
                                </div>
                                <Input
                                placeholder='输入你注册的 GitHub OAuth APP 的 ID'
                                value={inputs.GitHubClientId}
                                name='GitHubClientId'
                                onChange={(value) => handleInputChange('GitHubClientId', value)}
                                />
                            </div>
                            <div style={{ width: '50%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>GitHub Client Secret</Typography.Text>
                                </div>
                                <Input
                                placeholder='敏感信息不会发送到前端显示'
                                value={inputs.password}
                                name='password'
                                onChange={(value) => handleInputChange('password', value)}
                                />
                            </div> 
                        </div>
                        <Button onClick={submitGitHubOAuth} style={{ marginTop: '3px' }}>保存 SMTP 设置</Button>

                    <Divider style={{ marginTop: '20px' , marginBottom: '10px' }}/>
                        <Typography.Title style={{ marginBottom: '10px'}} heading={5}>配置 WeChat Server</Typography.Title>
                        <Text style={{ marginBottom: '10px'}} heading={5}>
                            用以支持通过微信进行登录注册，
                                <a
                                    href='https://github.com/songquanpeng/wechat-server'
                                    target='_blank'
                                >
                                    点击此处
                                </a>
                                了解 WeChat Server
                        </Text>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ width: '30%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>WeChat Server 服务器地址</Typography.Text>
                                </div>
                                <Input
                                placeholder='例如：https://yourdomain.com'
                                value={inputs.WeChatServerAddress}
                                name='WeChatServerAddress'
                                onChange={(value) => handleInputChange('WeChatServerAddress', value)}
                                />
                            </div>
                            <div style={{ width: '30%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>WeChat Server 访问凭证</Typography.Text>
                                </div>
                                <Input
                                placeholder='敏感信息不会发送到前端显示'
                                value={inputs.WeChatServerToken}
                                name='WeChatServerToken'
                                onChange={(value) => handleInputChange('WeChatServerToken', value)}
                                />
                            </div> 
                            <div style={{ width: '30%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>微信公众号二维码图片链接</Typography.Text>
                                </div>
                                <Input
                                placeholder='输入一个图片链接'
                                value={inputs.WeChatAccountQRCodeImageURL}
                                name='WeChatAccountQRCodeImageURL'
                                onChange={(value) => handleInputChange('WeChatAccountQRCodeImageURL', value)}
                                />
                            </div> 
                        </div>
                        <Button onClick={submitWeChat} style={{ marginTop: '3px' }}>保存 WeChat Server 设置</Button>
   
                    <Divider style={{ marginTop: '20px' , marginBottom: '10px' }}/>
                    <Typography.Title style={{ marginBottom: '10px'}} heading={5}>配置 Turnstile</Typography.Title>
                    <Text style={{ marginBottom: '10px'}} heading={5}>
                            用以支持用户校验，
                            <a href='https://dash.cloudflare.com/' target='_blank'>
                                点击此处
                            </a>
                            管理你的 Turnstile Sites，推荐选择 Invisible Widget Type
                            </Text>

                        <div style={{width: '60%', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ width: '50%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>Turnstile Site Key</Typography.Text>
                                </div>
                                <Input
                                placeholder='输入你注册的 Turnstile Site Key'
                                value={inputs.TurnstileSiteKey}
                                name='TurnstileSiteKey'
                                onChange={(value) => handleInputChange('TurnstileSiteKey', value)}
                                />
                            </div>
                            <div style={{ width: '50%', marginRight: '5%' }}>
                                <div style={{ marginBottom: '10px' }}>
                                <Typography.Text strong>Turnstile Secret Key</Typography.Text>
                                </div>
                                <Input
                                placeholder='敏感信息不会发送到前端显示'
                                value={inputs.TurnstileSecretKey}
                                name='TurnstileSecretKey'
                                onChange={(value) => handleInputChange('TurnstileSecretKey', value)}
                                />
                            </div> 
                        </div>
                        <Button onClick={submitTurnstile} style={{ marginTop: '3px' }}>保存 Turnstile 设置</Button>

                </Form>

            </Layout>
      </Spin>
    );
};

export default SystemSetting;