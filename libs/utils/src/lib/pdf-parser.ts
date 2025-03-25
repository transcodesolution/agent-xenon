import axios from "axios";
import PdfParse from "pdf-parse";

export async function getResumeParsedText(s3UrlLink: string) {
    // const buffer = fs.readFileSync(fileName);
    const response = await axios({
        url: s3UrlLink,
        method: 'GET',
        responseType: 'arraybuffer',
    });
    const data = await PdfParse(Buffer.from(response.data));
    return data.text;
}