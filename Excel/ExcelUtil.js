import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

export default class ExcelUtil {

    static resolvePath(relativePath) {
        return path.resolve(process.cwd(), relativePath);
    }

    static read(filePath, sheetName, rowNo, colNo) {
        const resolvedPath = this.resolvePath(filePath);

        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`Excel file not found at: ${resolvedPath}`);
        }

        const workbook = xlsx.readFile(resolvedPath);
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
            throw new Error(`Sheet "${sheetName}" not found`);
        }

        const cellAddress = xlsx.utils.encode_cell({
            r: rowNo - 1,
            c: colNo - 1
        });

        return sheet[cellAddress]?.v ?? null;
    }

    static write(filePath, sheetName, rowNo, colNo, value) {
        const resolvedPath = this.resolvePath(filePath);

        const workbook = fs.existsSync(resolvedPath)
            ? xlsx.readFile(resolvedPath)
            : xlsx.utils.book_new();

        let sheet = workbook.Sheets[sheetName];

        if (!sheet) {
            sheet = xlsx.utils.aoa_to_sheet([]);
            xlsx.utils.book_append_sheet(workbook, sheet, sheetName);
        }

        const cellAddress = xlsx.utils.encode_cell({
            r: rowNo - 1,
            c: colNo - 1
        });

        sheet[cellAddress] = { t: 's', v: value };

        xlsx.writeFile(workbook, resolvedPath);
    }
}
