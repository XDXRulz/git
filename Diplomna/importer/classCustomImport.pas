unit classCustomImport;
interface
uses
  Classes, Oracle, ZhivkoCommon, ZhivkoDAC, ZhivkoOracle;

type
  TCustomDataImport = class
  private
    FDatabase: TOracleSession;
    FTools: TZhivkoOracleTools;
    FOnCheckTerminated: TZhivkoTerminatedEvent;
    FOnProcessMessages: TZhivkoProcessMessagesEvent;
  protected
    function Terminated : Boolean;
    procedure ProcessMessages;
  public
    constructor Create; virtual;
    destructor Destroy; override;
    function Connect : Boolean;
    function Connected : Boolean;
    procedure Disconnect;
    procedure Setup ( AConnection:String );
  public
    property Database: TOracleSession read FDatabase;
    property Tools: TZhivkoOracleTools read FTools;
    property OnCheckTerminated: TZhivkoTerminatedEvent read FOnCheckTerminated write FOnCheckTerminated;
    property OnProcessMessages: TZhivkoProcessMessagesEvent read FOnProcessMessages write FOnProcessMessages;
  end;

implementation
uses
  SysUtils, ZhivkoStrings, ZhivkoNet, unitCommonOptions;

{ TCustomDataImport }

constructor TCustomDataImport.Create;
begin
  inherited Create;
  FDatabase := TOracleSession.Create(nil);
  FTools := TZhivkoOracleTools.Create(nil);
  FTools.Session := FDatabase;
end;

destructor TCustomDataImport.Destroy;
begin
  Disconnect;
  FTools.Free;
  FDatabase.Free;
  inherited;
end;

function TCustomDataImport.Connect : Boolean;
var
  host: String;
  pingOk: Boolean;
begin
  Self.Disconnect;
  host := OraDatabaseHost(FDatabase.LogonDatabase);
  if host > '' then begin
    // ако е разрешено, опитва ping до сървъра на базата данни
    if CommonOptions.PingEnabled then begin
      pingOk := PingHost(host);
      if not pingOk then
        CommonOptions.LogError('Oracle: No ping to server on '+ host);
    end else
      pingOk := True;
    // ако има ping, се опитва връзка с базата данни
    if pingOk then begin
      try
        FDatabase.LogOn;
      except
        on e:Exception do
          CommonOptions.LogError('Oracle: '+ e.Message);
      end;
    end;
  end else
    CommonOptions.LogError('Oracle connection is not set up');
  Result := FDatabase.Connected;
end;

function TCustomDataImport.Connected : Boolean;
begin
  Result := FDatabase.Connected;
end;

procedure TCustomDataImport.Disconnect;
begin
  if FDatabase.Connected then
    FDatabase.LogOff;
end;

procedure TCustomDataImport.Setup ( AConnection:String );
begin
  FDatabase.LogonDatabase := Fetch(AConnection, '|');
  FDatabase.LogonUsername := Fetch(AConnection, '|');
  FDatabase.LogonPassword := Fetch(AConnection, '|');
end;

function TCustomDataImport.Terminated : Boolean;
begin
  if Assigned(FOnCheckTerminated)
    then Result := FOnCheckTerminated
    else Result := False;
end;

procedure TCustomDataImport.ProcessMessages;
begin
  if Assigned(FOnProcessMessages) then
    FOnProcessMessages;
end;

end.
