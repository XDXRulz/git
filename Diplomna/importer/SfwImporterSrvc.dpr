program SfwImporterSrvc;

uses
  SvcMgr,
  unitSrvcMain in 'unitSrvcMain.pas' {SfwImportService: TService},
  unitCommonOptions in '..\..\..\AirCommon\unitCommonOptions.pas',
  classCustomImport in 'classCustomImport.pas',
  classImportData in 'classImportData.pas',
  classImportSetup in 'classImportSetup.pas',
  unitAirUtils in '..\..\..\AirCommon\unitAirUtils.pas';

{$R *.RES}

begin
  Application.Initialize;
  Application.Title := 'SfwImporterSrvc';
  Application.CreateForm(TSfwImportService, SfwImportService);
  Application.Run;
end.
