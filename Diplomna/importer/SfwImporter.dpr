program SfwImporter;

uses
  Forms,
  unitMain in 'unitMain.pas' {FormMain},
  classCustomImport in 'classCustomImport.pas',
  unitCommonOptions in '..\..\..\AirCommon\unitCommonOptions.pas',
  classImportSetup in 'classImportSetup.pas',
  classImportData in 'classImportData.pas',
  unitAirUtils in '..\..\..\AirCommon\unitAirUtils.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.Title := 'SfwImporter';
  Application.CreateForm(TFormMain, FormMain);
  Application.Run;
end.
