import { Data } from "./data";


export interface AboutDialog {
    title: string;
    content: string | Data;
    showBtn: boolean;
    curBlock?: String;
}