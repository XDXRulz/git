unit unitSrvcMain;
interface
uses
  Windows, Messages, SysUtils, Classes, Graphics, Controls, SvcMgr, Dialogs;

type
  TSfwImportService = class(TService)
    procedure ServiceAfterInstall ( Sender:TService );
    procedure ServiceCreate ( Sender:TObject );
    procedure ServiceStart ( Sender:TService; var Started:Boolean );
    procedure ServiceStop ( Sender:TService; var Stopped:Boolean );
    procedure ServicePause ( Sender:TService; var Paused:Boolean );
    procedure ServiceContinue ( Sender:TService; var Continued:Boolean );
    procedure ServiceExecute ( Sender:TService );
  private
    FPaused: Boolean;
    FNextSyncData: TDateTime;
    FNextSyncSetup: TDateTime;
    procedure DoReadData;
    procedure DoReadSetup;
  public
    function GetServiceController: TServiceController; override;
    function DoGetTerminated : Boolean;
    procedure DoProcessMessages;
  end;

var
  SfwImportService: TSfwImportService;

implementation
uses
  Registry, DateUtils, ZhivkoDates,
  unitCommonOptions, classImportSetup, classImportData;

{$R *.DFM}

procedure ServiceController(CtrlCode: DWord); stdcall;
begin
  SfwImportService.Controller(CtrlCode);
end;

function TSfwImportService.GetServiceController: TServiceController;
begin
  Result := ServiceController;
end;

procedure TSfwImportService.ServiceAfterInstall ( Sender:TService );
var
  reg: TRegistry;
begin
  reg := TRegistry.Create(KEY_READ or KEY_WRITE);
  try
    reg.RootKey := HKEY_LOCAL_MACHINE;
    if reg.OpenKey('\SYSTEM\CurrentControlSet\Services\' + Name, False) then begin
      reg.WriteString('Description', 'SfwImporter service by InfoLogica');
      reg.CloseKey;
    end;
  finally
    reg.Free;
  end;
end;

procedure TSfwImportService.ServiceCreate ( Sender:TObject );
begin
  FPaused := False;
  FNextSyncData := YMDHToDate(CommonOptions.ReadString(iniSectionSetup, 'ReadDataTime', FormatDateTime('yyyymmddhhnn', Now)));
  FNextSyncSetup := YMDHToDate(CommonOptions.ReadString(iniSectionSetup, 'ReadSetupTime', FormatDateTime('yyyymmddhhnn', Now)));
end;

procedure TSfwImportService.ServiceStart ( Sender:TService; var Started:Boolean );
begin
  CommonOptions.Log('Service started');
end;

procedure TSfwImportService.ServiceStop ( Sender:TService; var Stopped:Boolean );
begin
  CommonOptions.Log('Service stopped');
end;

procedure TSfwImportService.ServicePause ( Sender:TService; var Paused:Boolean );
begin
  FPaused := True;
end;

procedure TSfwImportService.ServiceContinue ( Sender:TService; var Continued:Boolean );
begin
  FPaused := False;
end;

procedure TSfwImportService.ServiceExecute ( Sender:TService );
begin
  while not Terminated do begin
    if CompareDateTime(FNextSyncSetup, Now) < 0 then try
      DoReadSetup;
    finally
      FNextSyncSetup := IncHour(Now, CommonOptions.ReadInteger(iniSectionSetup, 'ReadSetupIntervalHours', 24));
      CommonOptions.WriteString(iniSectionSetup, 'ReadSetupTime', FormatDateTime('yyyymmddhhnn', FNextSyncSetup));
      CommonOptions.Log('Next setup read at ' + FormatDateTime('dd.mm.yyyy hh:nn', FNextSyncSetup));
    end;

    if CompareDateTime(FNextSyncData, Now) < 0 then try
      DoReadData;
    finally
      FNextSyncData := IncMinute(Now, CommonOptions.ReadInteger(iniSectionSetup, 'ReadDataIntervalMinutes', 60));
      CommonOptions.WriteString(iniSectionSetup, 'ReadDataTime', FormatDateTime('yyyymmddhhnn', FNextSyncData));
      CommonOptions.Log('Next data read at ' + FormatDateTime('dd.mm.yyyy hh:nn', FNextSyncData));
    end;

    Sleep(1000);
    DoProcessMessages;
  end;
end;

function TSfwImportService.DoGetTerminated : Boolean;
begin
  Result := Self.Terminated or FPaused;
end;

procedure TSfwImportService.DoProcessMessages;
begin
  ServiceThread.ProcessRequests(False);
end;

procedure TSfwImportService.DoReadData;
var
  folder: String;
  worker: TImportData;
begin
  folder := CommonOptions.ReadString(iniSectionSetup, 'DataFolder', '');
  if (folder > '') then begin
    worker := TImportData.Create();
    try
      worker.OnCheckTerminated := DoGetTerminated;
      worker.OnProcessMessages := DoProcessMessages;
      worker.Setup(CommonOptions.ReadString(iniSectionSetup, 'OracleDatabase', ''));
      worker.ExecuteFolder(folder);
    finally
      worker.Free;
    end;
  end;
end;

procedure TSfwImportService.DoReadSetup;
var
  fn: String;
  worker: TImportSetup;
begin
  fn := CommonOptions.ReadString(iniSectionSetup, 'SetupFile', '');
  if fn > '' then begin
    worker := TImportSetup.Create();
    try
      worker.OnCheckTerminated := DoGetTerminated;
      worker.OnProcessMessages := DoProcessMessages;
      worker.Setup(CommonOptions.ReadString(iniSectionSetup, 'OracleDatabase', ''));
      worker.Execute(fn);
    finally
      worker.Free;
    end;
  end;
end;

end.
