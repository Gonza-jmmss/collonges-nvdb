BEGIN TRY

BEGIN TRAN;

-- CreateSchema
EXEC sp_executesql N'CREATE SCHEMA [Core];';;

-- CreateSchema
EXEC sp_executesql N'CREATE SCHEMA [Courses];';;

-- CreateSchema
EXEC sp_executesql N'CREATE SCHEMA [Persons];';;

-- CreateSchema
EXEC sp_executesql N'CREATE SCHEMA [Students];';;

-- CreateTable
CREATE TABLE [Core].[Accommodations] (
    [AccommodationId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50),
    [Abbreviation] NVARCHAR(10),
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Accommodations_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Accommod__DBB30A519E5B949C] PRIMARY KEY CLUSTERED ([AccommodationId])
);

-- CreateTable
CREATE TABLE [Students].[Alumins] (
    [AlumniId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50) NOT NULL,
    [StudentId] INT NOT NULL,
    [DiplomaId] INT NOT NULL,
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Alumins_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Alumins__9336246AA15F7EC9] PRIMARY KEY CLUSTERED ([AlumniId])
);

-- CreateTable
CREATE TABLE [Core].[Colleges] (
    [CollegeId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50),
    [Abbreviation] NVARCHAR(10),
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Colleges_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Colleges__29409539FE28E65B] PRIMARY KEY CLUSTERED ([CollegeId])
);

-- CreateTable
CREATE TABLE [Persons].[Contacts] (
    [ContactId] INT NOT NULL,
    [PersonId] INT NOT NULL,
    [ContactTypeId] INT NOT NULL,
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Contacts_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Contacts__16C4DA259B578370] PRIMARY KEY CLUSTERED ([ContactId],[PersonId])
);

-- CreateTable
CREATE TABLE [Persons].[ContactTypes] (
    [ContactTypeId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50) NOT NULL,
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ContactTypes_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__ContactT__17E1EE12F1060007] PRIMARY KEY CLUSTERED ([ContactTypeId])
);

-- CreateTable
CREATE TABLE [Core].[Countries] (
    [CountryId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50) NOT NULL,
    [ISO2] NVARCHAR(5),
    [ISO3] NVARCHAR(5),
    [PhoneCode] NVARCHAR(50),
    [NameEnglish] NVARCHAR(50),
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Countries_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Countrie__10D1609FF8C41E7A] PRIMARY KEY CLUSTERED ([CountryId])
);

-- CreateTable
CREATE TABLE [Courses].[Courses] (
    [CoursId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50) NOT NULL,
    [EnglishName] NVARCHAR(50) NOT NULL,
    [CourseCode] NVARCHAR(50),
    [CreditAmount] INT NOT NULL,
    [CoursPeriodId] INT NOT NULL,
    [PeriodNumber] INT,
    [CoursesTypeId] INT NOT NULL,
    [IsEnabled] BIT,
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Courses_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Courses__DA537785C1FC6AFA] PRIMARY KEY CLUSTERED ([CoursId])
);

-- CreateTable
CREATE TABLE [Courses].[CoursesTypes] (
    [CoursTypeId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50) NOT NULL,
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [CoursesTypes_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__CoursesT__56A57B3E62FBA2B7] PRIMARY KEY CLUSTERED ([CoursTypeId])
);

-- CreateTable
CREATE TABLE [Courses].[CoursPeriods] (
    [CoursPeriodId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50) NOT NULL,
    [MonthAmount] INT NOT NULL,
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [CoursPeriods_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__CoursPer__EACACD3ABDE3E123] PRIMARY KEY CLUSTERED ([CoursPeriodId])
);

-- CreateTable
CREATE TABLE [Core].[Departments] (
    [DepartmentId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50),
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Departments_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Departme__B2079BED8B2D5595] PRIMARY KEY CLUSTERED ([DepartmentId])
);

-- CreateTable
CREATE TABLE [Students].[Diplomas] (
    [DiplomaId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50) NOT NULL,
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Diplomas_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Diplomas__048740506CA0A920] PRIMARY KEY CLUSTERED ([DiplomaId])
);

-- CreateTable
CREATE TABLE [Students].[Matriculations] (
    [MatriculationId] INT NOT NULL IDENTITY(1,1),
    [FromDate] DATE NOT NULL,
    [ToDate] DATE,
    [StudentId] INT NOT NULL,
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Matriculations_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Matricul__F3FC131F20872CBB] PRIMARY KEY CLUSTERED ([MatriculationId])
);

-- CreateTable
CREATE TABLE [Persons].[PersonCountries] (
    [PersonCountryId] INT NOT NULL IDENTITY(1,1),
    [PersonId] INT NOT NULL,
    [CountryId] INT NOT NULL,
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [PersonCountries_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__PersonCo__8E05EF06E195278C] PRIMARY KEY CLUSTERED ([PersonCountryId])
);

-- CreateTable
CREATE TABLE [Persons].[Persons] (
    [PersonId] INT NOT NULL IDENTITY(1,1),
    [FirstName] NVARCHAR(50),
    [LastName] NVARCHAR(50),
    [AlternativeName] NVARCHAR(100),
    [BirthDate] DATE,
    [Sex] INT,
    [Telephone] NVARCHAR(20),
    [WorkTelephone] NVARCHAR(20),
    [CivilStatus] INT,
    [ReligionId] INT,
    [Profession] NVARCHAR(50),
    [BirthCity] NVARCHAR(50),
    [Address1] NVARCHAR(100),
    [Address2] NVARCHAR(100),
    [Address3] NVARCHAR(100),
    [CountryId] INT,
    [BirthCountryId] INT,
    [Email] NVARCHAR(50),
    [DBaseCode] NVARCHAR(10),
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Persons_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Persons__AA2FFBE545B07A2A] PRIMARY KEY CLUSTERED ([PersonId])
);

-- CreateTable
CREATE TABLE [Core].[Regimes] (
    [RegimeId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50),
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Regimes_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Regimes__B8947F98B9F34A5C] PRIMARY KEY CLUSTERED ([RegimeId])
);

-- CreateTable
CREATE TABLE [Core].[Religions] (
    [ReligionId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50) NOT NULL,
    [Abbreviation] NVARCHAR(5),
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Religions_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Religion__D3ADAB6A4C69A528] PRIMARY KEY CLUSTERED ([ReligionId])
);

-- CreateTable
CREATE TABLE [Courses].[ScholarYears] (
    [ScholarYearId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50) NOT NULL,
    [FromDate] DATE,
    [ToDate] DATE,
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ScholarYears_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__ScholarY__C79D4AB8314891EB] PRIMARY KEY CLUSTERED ([ScholarYearId])
);

-- CreateTable
CREATE TABLE [Courses].[StudentCourses] (
    [StudentCoursId] INT NOT NULL IDENTITY(1,1),
    [StudentId] INT NOT NULL,
    [CoursId] INT NOT NULL,
    [Note] NVARCHAR(5) NOT NULL,
    [ScholarYearId] INT NOT NULL,
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [StudentCourses_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__StudentC__79F228C2995AE57D] PRIMARY KEY CLUSTERED ([StudentCoursId])
);

-- CreateTable
CREATE TABLE [Students].[Students] (
    [StudentId] INT NOT NULL IDENTITY(1,1),
    [PersonId] INT NOT NULL,
    [StudentTypeId] INT NOT NULL,
    [IsACA] BIT NOT NULL,
    [DepartmentId] INT,
    [CollegeId] INT,
    [RegimeId] INT,
    [AccommodationId] INT,
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Students_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Students__32C52B99C6A081B4] PRIMARY KEY CLUSTERED ([StudentId])
);

-- CreateTable
CREATE TABLE [Students].[StudentTypes] (
    [StudentTypeId] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50) NOT NULL,
    [UpdatedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [StudentTypes_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__StudentT__42041DBAD33305DF] PRIMARY KEY CLUSTERED ([StudentTypeId])
);

-- AddForeignKey
ALTER TABLE [Students].[Alumins] ADD CONSTRAINT [FK_Alumins_Diplomas] FOREIGN KEY ([DiplomaId]) REFERENCES [Students].[Diplomas]([DiplomaId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Students].[Alumins] ADD CONSTRAINT [FK_Alumins_Students] FOREIGN KEY ([StudentId]) REFERENCES [Students].[Students]([StudentId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Persons].[Contacts] ADD CONSTRAINT [FK_Contacts_ContactPersons] FOREIGN KEY ([ContactId]) REFERENCES [Persons].[Persons]([PersonId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Persons].[Contacts] ADD CONSTRAINT [FK_Contacts_ContactTypes] FOREIGN KEY ([ContactTypeId]) REFERENCES [Persons].[ContactTypes]([ContactTypeId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Persons].[Contacts] ADD CONSTRAINT [FK_Contacts_Persons] FOREIGN KEY ([PersonId]) REFERENCES [Persons].[Persons]([PersonId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Courses].[Courses] ADD CONSTRAINT [FK_Courses_CoursPeriods] FOREIGN KEY ([CoursPeriodId]) REFERENCES [Courses].[CoursPeriods]([CoursPeriodId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Students].[Matriculations] ADD CONSTRAINT [FK_Matriculations_Students] FOREIGN KEY ([StudentId]) REFERENCES [Students].[Students]([StudentId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Persons].[PersonCountries] ADD CONSTRAINT [FK_PersonCountries_Countries] FOREIGN KEY ([CountryId]) REFERENCES [Core].[Countries]([CountryId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Persons].[PersonCountries] ADD CONSTRAINT [FK_PersonCountries_Persons] FOREIGN KEY ([PersonId]) REFERENCES [Persons].[Persons]([PersonId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Persons].[Persons] ADD CONSTRAINT [FK_Persons_Religions] FOREIGN KEY ([ReligionId]) REFERENCES [Core].[Religions]([ReligionId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Persons].[Persons] ADD CONSTRAINT [FK_PersonsBirth_Countries] FOREIGN KEY ([BirthCountryId]) REFERENCES [Core].[Countries]([CountryId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Courses].[StudentCourses] ADD CONSTRAINT [FK_StudentCourses_Courses] FOREIGN KEY ([CoursId]) REFERENCES [Courses].[Courses]([CoursId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Courses].[StudentCourses] ADD CONSTRAINT [FK_StudentCourses_ScholarYears] FOREIGN KEY ([ScholarYearId]) REFERENCES [Courses].[ScholarYears]([ScholarYearId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Courses].[StudentCourses] ADD CONSTRAINT [FK_StudentCourses_Students] FOREIGN KEY ([StudentId]) REFERENCES [Students].[Students]([StudentId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Students].[Students] ADD CONSTRAINT [FK_Students_Accommodations] FOREIGN KEY ([AccommodationId]) REFERENCES [Core].[Accommodations]([AccommodationId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Students].[Students] ADD CONSTRAINT [FK_Students_Colleges] FOREIGN KEY ([CollegeId]) REFERENCES [Core].[Colleges]([CollegeId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Students].[Students] ADD CONSTRAINT [FK_Students_Persons] FOREIGN KEY ([PersonId]) REFERENCES [Persons].[Persons]([PersonId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Students].[Students] ADD CONSTRAINT [FK_Students_Regimes] FOREIGN KEY ([RegimeId]) REFERENCES [Core].[Regimes]([RegimeId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Students].[Students] ADD CONSTRAINT [FK_Students_StudentTypes] FOREIGN KEY ([StudentTypeId]) REFERENCES [Students].[StudentTypes]([StudentTypeId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
