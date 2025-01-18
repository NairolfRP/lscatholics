import React from "react";
import { Trans as I18nextTrans } from "react-i18next";

export interface TransWrapperProps {
    i18nKey: string;
    values?: Record<string, unknown>;
    components?: readonly React.ReactElement[] | { readonly [tagName: string]: React.ReactElement };
    defaultText?: string;
}

export default function Trans({
    i18nKey,
    values = {},
    components = [],
    defaultText = "",
    children,
}: React.PropsWithChildren<TransWrapperProps>) {
    return (
        <I18nextTrans
            i18nKey={i18nKey}
            values={values}
            components={components}
            defaultValue={defaultText}
        >
            {children}
        </I18nextTrans>
    );
}
