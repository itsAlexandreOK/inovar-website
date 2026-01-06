export function validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let sum = 0;
    let reminder;

    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }

    reminder = (sum * 10) % 11;
    let firstCheckDigit = reminder === 10 || reminder === 11 ? 0 : reminder;

    if (firstCheckDigit !== parseInt(cpf.charAt(9))) {
        return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }

    reminder = (sum * 10) % 11;
    let secondCheckDigit = reminder === 10 || reminder === 11 ? 0 : reminder;

    if (secondCheckDigit !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
}