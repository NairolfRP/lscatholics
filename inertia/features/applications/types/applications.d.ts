import { ApplicationStatut } from "@/enums/application_statut";
import { ApplicationType } from "@/enums/application_type";
import { YesNoRadioFormValue } from "@/types/forms";

type ApplicationField = {
    value: string | number | boolean | Date;
    type: "string" | "integer" | "boolean" | "date" | "float";
};

interface Application {
    id: number;
    character_name: string;
    application_type: ApplicationType;
    status: ApplicationStatut;
    fields: Record<string, ApplicationField>;
}

interface Applicant {
    name: string;
}

export interface SingleApplicationProps {
    application: Application;
    applicant: Applicant;
}

interface School {
    name: string;
    year: string;
}

export interface HighSchool extends School {
    degree: "none" | "ged" | "diploma";
}

export interface Education extends School {
    degree: string;
    major: string;
}

export interface EmploymentInformation {
    companyName: string;
    position: string;
    duration: string;
    leavingReason: string;
}

export interface JobApplicationFormSubmission {
    firstname: string;
    lastname: string;
    phone: string;
    address: string;
    area: string;
    iban: string;
    isAdult: YesNoRadioFormValue;
    canProofRightToWork: YesNoRadioFormValue;
    hasDriverLicense: YesNoRadioFormValue;
    hasInsurance: YesNoRadioFormValue;
    applyingFor: string;
    highSchool: HighSchool;
    education: Education[];
    employmentInformation: EmploymentInformation[];
    signature: string;
    discordID: string;
    oocMotivations: string;
}
