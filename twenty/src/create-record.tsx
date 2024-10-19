import { Action, ActionPanel, Form, showToast, Toast, useNavigation } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import axios from "axios";
import { useState } from "react";
import { useAuthHeaders } from "./hooks/use-auth-headers";
import { Field } from "./types";

interface CreateFormFieldProps {
  node: Field[];
  objectName: string;
}

interface CreateRecordInputs {
  operationName: string;
  variables: {
    input: {
      id: string;
      name: string
      position: string
    }
  }
}

interface CreateRecordFormQuery {
  // TODO: complete this
}

interface CreateRecordProps extends CreateRecordInputs, CreateRecordFormQuery {}

const CreateFormFields = (fields: Field[], itemProps: any) => {
  // TODO: Add more input types (relation, currency)
  // WARN: Check if you can use itemProps[key] instead of itemProps.key
  // NOTE: Rich text is not supported in raycast, using textArea instead

  return (
    fields.map((field) => {
      field.type == "TEXT" && <Form.TextField key={field.id} title={field.name.charAt(0).toUpperCase + field.name.slice(1)} placeholder={`${field.name}`} {...itemProps[field.name]} />

      field.type == "PHONES" && <Form.TextField key={field.id} title={field.name.charAt(0).toUpperCase + field.name.slice(1)} placeholder="+1 (999) 964 1992" {...itemProps[field.name]} />

      field.type == "BOOLEAN" && <Form.Checkbox label={field.description} value={field?.defaultValue == true} {...itemProps[field.name]} />

      field.type == "NUMBER" || field.type == "NUMERIC" && <Form.TextField key={field.id} title={field.name.charAt(0).toUpperCase + field.name.slice(1)} placeholder="123789" {...itemProps[field.name]} />

      field.type == "LINKS" && <Form.TextField key={field.id} title={field.name.charAt(0).toUpperCase + field.name.slice(1)} placeholder="https://twenty.com" {...itemProps[field.name]} />

      field.type == "ADDRESS" && <Form.TextField key={field.id} title={field.name.charAt(0).toUpperCase + field.name.slice(1)} placeholder="99 Rd N Halton Hills, California, USA" {...itemProps[field.name]} />

      field.type == "RICH_TEXT" && <Form.TextArea key={field.id} title={field.name.charAt(0).toUpperCase + field.name.slice(1)} placeholder="Add some text here..." {...itemProps[field.name]} />

      field.type == "RATING" && (
        <Form.Dropdown title={field.name.charAt(0).toUpperCase + field.name.slice(1)} defaultValue="lol" {...itemProps[field.name]}>
          <Form.Dropdown.Item value="RATING_1" title="⭐"/>
          <Form.Dropdown.Item value="RATING_2" title="⭐⭐"/>
          <Form.Dropdown.Item value="RATING_3" title="⭐⭐⭐"/>
          <Form.Dropdown.Item value="RATING_4" title="⭐⭐⭐⭐"/>
          <Form.Dropdown.Item value="RATING_5" title="⭐⭐⭐⭐⭐"/>
        </Form.Dropdown>
      )
    })
  )
}

const createValidationSchema = (fields: Field[]) => {
  // FEAT: create schemaValidations for phone numbers, emails, boolean, number etc...
  let validationSchema: any = {}

  fields.forEach((field) => {
    if (!field.isNullable) {
      validationSchema[field.name] = FormValidation.Required
    }
  })

  return validationSchema
}

export default function CreateRecordForm({ node, objectName }: CreateFormFieldProps) {
  const { pop } = useNavigation();
  const [creationIsLoading, setCreationIsLoading] = useState(false);

  const { handleSubmit, itemProps } = useForm({
    async onSubmit(values) {
      if (!creationIsLoading) {
        setCreationIsLoading(true);

        const newRecord = await createRecord(values);

        if ("error" in newRecord) {
          setCreationIsLoading(false);
          await showToast({
            style: Toast.Style.Failure,
            title: "Failed to Create Company",
            message: newRecord.error.message,
          });
          return;
        }

        setCreationIsLoading(false);
        // Popping the current view instead of pushing it
        pop();
      }
    },

    validation: createValidationSchema(node),
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
      isLoading={creationIsLoading}
    >
      <Form.Description text={`Use this form to add records in ${objectName}`} />
      {CreateFormFields(node, itemProps)}
    </Form>
  );
}

const createRecord = async (values: CreateRecordProps): Promise<any> => {
  // TODO: Implement API call to create a record
};
