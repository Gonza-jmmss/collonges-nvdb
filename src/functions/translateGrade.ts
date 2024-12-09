const translateGrade = (frenchGrade: string): string => {
  const isNumberString: boolean = !isNaN(Number(frenchGrade));
  if (!isNumberString) return frenchGrade;

  const frenchGradeNumber: number = +frenchGrade;
  if (isNumberString && (frenchGradeNumber <= 0 || frenchGradeNumber >= 20)) {
    throw new Error("Invalid grade. Grade must be between 0 and 20.");
  }

  if (frenchGradeNumber >= 17) return "A";
  if (frenchGradeNumber >= 15) return "A-";
  if (frenchGradeNumber >= 14) return "B+";
  if (frenchGradeNumber >= 13) return "B";
  if (frenchGradeNumber >= 12) return "B-";
  if (frenchGradeNumber >= 11) return "C+";
  if (frenchGradeNumber >= 10) return "C";
  if (frenchGradeNumber >= 9) return "D";
  return "F";
};

export default translateGrade;

// DBase
//  20=> note => 17 = A
//  17 > note =< 15 = A-
//  15 > note =< 14 = B+
//  14 > note =< 13 = B
//  13 > note =< 12 = B-
//  12 > note =< 11 = C+
//  11 > note =< 10 = C
//  10 > note =< 09 = D
//       note <  09 = F
