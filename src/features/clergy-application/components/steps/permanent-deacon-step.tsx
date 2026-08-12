import { useNavigate } from '@tanstack/react-router'
import {
  ClergyApplicationForm,
} from '#/features/clergy-application/components/clergy-application-form.tsx'
import {
  CLERGY_ROLE,
} from '#/features/clergy-application/constants/clergy-application.constants.ts'
import {
  clergyApplicationFormOpts,
  handleSubmitClergyApplication,
} from '#/features/clergy-application/form/shared-clergy-application-form.ts'
import {
  permanentDeaconApplicationSchema,
} from '#/features/clergy-application/schemas/clergy-application.schema.ts'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const PermanentDeaconStep = withForm({
  ...clergyApplicationFormOpts(),
  props: {
    isLoading: true,
  },
  render: function Render({ form, isLoading }) {
    const navigate = useNavigate({ from: '/clergy-application' })

    return (
      <form.FormGroup
        name={CLERGY_ROLE.DEACON_PERMANENT}
        validators={{
          onChange: permanentDeaconApplicationSchema,
        }}
        onGroupSubmit={async ({ value, groupApi }) => {
          await handleSubmitClergyApplication(CLERGY_ROLE.DEACON_PERMANENT, value, groupApi)
          void navigate({ search: {}, resetScroll: true })
        }}
      >
        {(formGroup) => (
          <form
            id={form.formId}
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void formGroup.handleSubmit()
            }}
            className="contents"
          >
            <ClergyApplicationForm
              form={form}
              formGroup={formGroup}
              step={CLERGY_ROLE.DEACON_PERMANENT}
              isLoading={isLoading}
            />
          </form>
        )}
      </form.FormGroup>
    )
  },
})
