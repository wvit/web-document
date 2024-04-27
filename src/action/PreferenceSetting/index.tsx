import { memo, useState, useEffect } from 'react'
import Button from 'antd/es/button'
import Modal from 'antd/es/modal'
import Form from 'antd/es/form'
import InputNumber from 'antd/es/input-number'
import Radio from 'antd/es/radio'
import { getI18n } from '@/utils'
import { objectHandles } from '@/utils/idb'

const { Item, useForm } = Form

export type PreferenceSettingType = {
  /** 列表展示类型 */
  listDisplayType: 'default' | 'domain'
  /** 页面图片保存类型 */
  imageSaveType: 'download' | 'url'
  /** 图片最大缓存限制 */
  imageDownloadMaxSize: number
}

export interface PreferenceSettingProps {
  /** 偏好设置数据发生改变 */
  onChange?: (setting: PreferenceSettingType) => void
}

/** 偏好设置 */
export const PreferenceSetting = memo((props: PreferenceSettingProps) => {
  const { onChange } = props
  const [settingVisible, setSettingVisible] = useState(false)
  const [formRef] = useForm()

  /** 获取偏好设置数据 */
  const getPreferenceSetting = async () => {
    const preferenceSetting = await objectHandles.globalConfig.get()

    formRef.setFieldsValue(preferenceSetting)
    onChange?.(preferenceSetting as PreferenceSettingType)
  }

  /** 保存偏好配置 */
  const savePreferenceSetting = async () => {
    const values = await formRef.validateFields()

    await objectHandles.globalConfig.set(values)

    setSettingVisible(false)
  }

  useEffect(() => {
    getPreferenceSetting()
  }, [settingVisible])

  return (
    <>
      <Modal
        open={settingVisible}
        width="65vw"
        title="偏好设置"
        styles={{ header: { margin: 0 } }}
        onCancel={() => setSettingVisible(false)}
        onOk={savePreferenceSetting}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={formRef}
          className="flex flex-col pt-6"
          initialValues={{
            listDisplayType: 'default',
            imageSaveType: 'download',
            imageDownloadMaxSize: 1,
          }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Item name="listDisplayType" label="排列方式">
            <Radio.Group
              options={[
                { label: getI18n('默认排列'), value: 'default' },
                { label: getI18n('按网站排列'), value: 'domain' },
              ]}
            />
          </Item>

          <Item name="imageSaveType" label="图片保存方式">
            <Radio.Group
              options={[
                { label: '下载并缓存', value: 'download' },
                { label: '保留原始url', value: 'url' },
              ]}
            />
          </Item>

          <Item noStyle dependencies={['imageSaveType']}>
            {() => {
              return (
                formRef.getFieldValue('imageSaveType') === 'download' && (
                  <Item
                    required
                    label="最大缓存图片"
                    help={
                      <span className="text-xs">
                        超过此大小的图片将会被忽略
                      </span>
                    }
                  >
                    <div className="flex items-center">
                      <Item
                        noStyle
                        name="imageDownloadMaxSize"
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          min={1}
                          max={10}
                          step={1}
                          className=" mr-1"
                          placeholder="1 ~ 10"
                        />
                      </Item>
                      MB
                    </div>
                  </Item>
                )
              )
            }}
          </Item>
        </Form>
      </Modal>
      <Button
        className="mx-1"
        size="small"
        onClick={() => setSettingVisible(true)}
      >
        偏好设置
      </Button>
    </>
  )
})
