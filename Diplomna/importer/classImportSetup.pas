unit classImportSetup;
interface
uses
  Classes, classCustomImport, KADaoDatabase, KADaoTable;

type
  TImportSetup = class(TCustomDataImport)
  private
    FMdbDatabase: TKADaoDatabase;
  protected
    procedure ImportParams;
    procedure ImportStations;
    procedure ImportStationParams;
    procedure UpdateParam ( AParamCode:Integer; const AParamName,AUnits,ADisplayFmt:String;
      AHourlyAlert,AHourlyAlarm,ADailyAlert,ADailyAlarm:Double; ADailyRatio:Integer );
    procedure UpdateStation ( const AStationCode,AStationName,ALocation,ACoordinates:String; AInScan:Boolean );
    procedure UpdateStationParam ( const AStationCode:String; AParamCode,AParamNum:Integer; AInScan:Boolean );
  public
    constructor Create; override;
    destructor Destroy; override;
    function Execute ( const AFileName:String ): Boolean;
  end;

implementation
uses
  SysUtils, ZhivkoOracle, unitCommonOptions;

{ TImportSetup }

constructor TImportSetup.Create;
begin
  inherited Create;
  FMdbDatabase := TKADaoDatabase.Create(nil);
end;

destructor TImportSetup.Destroy;
begin
  FMdbDatabase.Free;
  inherited;
end;

function TImportSetup.Execute ( const AFileName:String ): Boolean;
begin
  Result := False;
  CommonOptions.Log('Reading setup file "%s"...', [AFileName]);
  if Connect then begin
    if FileExists(AFileName) then begin
      FMdbDatabase.Database := AFileName;
      try
        FMdbDatabase.Open;
        if not Terminated then ImportParams;
        if not Terminated then ImportStations;
        if not Terminated then ImportStationParams;
        Result := not Terminated;
      except
        on e:Exception do
          CommonOptions.LogError('Cannot connect to Access database: ' + e.Message);
      end;
    end else
      CommonOptions.LogError('File "%s" does not exists.', [AFileName]);
  end else
    CommonOptions.LogError('Cannot connect to Oracle database.');
end;

procedure TImportSetup.ImportParams;
var
  source: TKADaoTable;
begin
  source := TKADaoTable.Create(nil);
  try
    source.Database := FMdbDatabase;
    source.SQL.Text :=
      'SELECT Codice AS PARAM_CODE, Nome AS PARAM_NAME, Unita AS UNITS, '+
        'Formato AS DISPLAY_FMT, LimiteOrarioAtt AS HOURLY_ALERT, '+
        'LimiteOrario AS HOURLY_ALARM, LimiteGiornalieroAtt AS DAILY_ALERT, '+
        'LimiteGiornaliero AS DAILY_ALARM, MinGiornaliero AS DAILY_RATIO '+
      'FROM Parametri '+
      'GROUP BY Codice, Nome, Unita, Formato, LimiteOrarioAtt, LimiteOrario, '+
        'LimiteGiornalieroAtt, LimiteGiornaliero, MinGiornaliero '+
      'ORDER BY Codice';
    source.Open;
    while (not source.EOF) and (not Terminated) do begin
      ProcessMessages;
      UpdateParam(
        source.FieldByName('PARAM_CODE').AsInteger,
        source.FieldByName('PARAM_NAME').AsString,
        source.FieldByName('UNITS').AsString,
        source.FieldByName('DISPLAY_FMT').AsString,
        source.FieldByName('HOURLY_ALERT').AsFloat,
        source.FieldByName('HOURLY_ALARM').AsFloat,
        source.FieldByName('DAILY_ALERT').AsFloat,
        source.FieldByName('DAILY_ALARM').AsFloat,
        source.FieldByName('DAILY_RATIO').AsInteger
      );
      source.Next;
    end;
  finally
    source.Free;
  end;
end;

procedure TImportSetup.ImportStations;
var
  source: TKADaoTable;
begin
  source := TKADaoTable.Create(nil);
  try
    source.Database := FMdbDatabase;
    source.SQL.Text :=
      'SELECT sigla AS STATION_CODE, NomeEsteso AS STATION_NAME, '+
        'Ubicazione AS LOCATION, Coord AS COORDINATES, FlagAttivazione AS IN_SCAN '+
      'FROM Stazioni '+
      'ORDER BY sigla';
    source.Open;
    while (not source.EOF) and (not Terminated) do begin
      ProcessMessages;
      UpdateStation(
        source.FieldByName('STATION_CODE').AsString,
        source.FieldByName('STATION_NAME').AsString,
        source.FieldByName('LOCATION').AsString,
        source.FieldByName('COORDINATES').AsString,
        source.FieldByName('IN_SCAN').AsBoolean
      );
      source.Next;
    end;
  finally
    source.Free;
  end;
end;

procedure TImportSetup.ImportStationParams;
var
  source: TKADaoTable;
  saveStation: String;
  paramNum: Integer;
begin
  paramNum := 0;
  source := TKADaoTable.Create(nil);
  try
    source.Database := FMdbDatabase;
    source.SQL.Text :=
      'SELECT Sigla AS STATION_CODE, Codice AS PARAM_CODE, '+
        'OrderField AS PARAM_NUM, Scansione AS IN_SCAN '+
      'FROM Parametri '+
      'ORDER BY Sigla, OrderField';
    source.Open;
    saveStation := '';
    while (not source.EOF) and (not Terminated) do begin
      ProcessMessages;
      if (saveStation <> source.FieldByName('STATION_CODE').AsString) then begin
        saveStation := source.FieldByName('STATION_CODE').AsString;
        paramNum := 0;
      end;
      Inc(paramNum);
      UpdateStationParam(
        source.FieldByName('STATION_CODE').AsString,
        source.FieldByName('PARAM_CODE').AsInteger,
        paramNum, //source.FieldByName('PARAM_NUM').AsInteger,
        source.FieldByName('IN_SCAN').AsBoolean
      );
      source.Next;
    end;
  finally
    source.Free;
  end;
end;

procedure TImportSetup.UpdateParam ( AParamCode:Integer; const AParamName,AUnits,ADisplayFmt:String;
  AHourlyAlert,AHourlyAlarm,ADailyAlert,ADailyAlarm:Double; ADailyRatio:Integer );
begin
  if Tools.DataExists(AParamCode, 'SFW_AS_PARAMS', 'PARAM_CODE') then begin
    Tools.Execute('update SFW_AS_PARAMS set PARAM_NAME=%s,UNITS=%s,DISPLAY_FMT=%s,'+
      'HOURLY_ALERT=%s,HOURLY_ALARM=%s,DAILY_ALERT=%s,DAILY_ALARM=%s,DAILY_RATIO=%s '+
      'where PARAM_CODE=%d', [OraString(AParamName), OraString(AUnits), OraString(ADisplayFmt),
      OraFloatNull(AHourlyAlert, 6), OraFloatNull(AHourlyAlarm, 6),
      OraFloatNull(ADailyAlert, 6), OraFloatNull(ADailyAlarm, 6),
      OraIntegerNull(ADailyRatio), AParamCode]);
  end else begin
    Tools.Execute('insert into SFW_AS_PARAMS (PARAM_NAME,UNITS,DISPLAY_FMT,HOURLY_ALERT,'+
      'HOURLY_ALARM,DAILY_ALERT,DAILY_ALARM,DAILY_RATIO,PARAM_CODE) '+
      'values (%s,%s,%s,%s,%s,%s,%s,%s,%d)',
      [OraStringNull(AParamName), OraStringNull(AUnits), OraStringNull(ADisplayFmt),
      OraFloatNull(AHourlyAlert, 6), OraFloatNull(AHourlyAlarm, 6),
      OraFloatNull(ADailyAlert, 6), OraFloatNull(ADailyAlarm, 6),
      OraIntegerNull(ADailyRatio), AParamCode]);
  end;
end;

procedure TImportSetup.UpdateStation ( const AStationCode,AStationName,
  ALocation,ACoordinates:String; AInScan:Boolean );
begin
  if Tools.DataExists(AStationCode, 'SFW_AS_STATIONS', 'STATION_CODE') then begin
    Tools.Execute('update SFW_AS_STATIONS set STATION_NAME_EN=%s,LOCATION=%s,COORDINATES=%s,'+
      'IN_SCAN=%s where STATION_CODE=%s',
      [OraStringNull(AStationName), OraStringNull(ALocation), OraStringNull(ACoordinates),
       OraBoolean(AInScan), OraString(AStationCode)]);
  end else begin
    Tools.Execute('insert into SFW_AS_STATIONS (STATION_NAME_EN,LOCATION,COORDINATES,'+
      'IN_SCAN,VISIBLE,STATION_CODE) values (%s,%s,%s,%s,%s,%s)',
      [OraStringNull(AStationName), OraStringNull(ALocation), OraStringNull(ACoordinates),
       OraBoolean(AInScan), OraBoolean(AInScan), OraString(AStationCode)]);
  end;
end;

procedure TImportSetup.UpdateStationParam ( const AStationCode:String;
  AParamCode,AParamNum:Integer; AInScan:Boolean );
begin
  if Tools.GetInteger('select count(*) from SFW_AS_STAT_PARAMS '+
       'where STATION_CODE=%s and PARAM_CODE=%d', [OraString(AStationCode), AParamCode]) > 0 then begin
    Tools.Execute('update SFW_AS_STAT_PARAMS set PARAM_NUM=%d,IN_SCAN=%s '+
      'where STATION_CODE=%s and PARAM_CODE=%d',
      [AParamNum, OraBoolean(AInScan), OraString(AStationCode), AParamCode]);
  end else begin
    Tools.Execute('insert into SFW_AS_STAT_PARAMS (PARAM_NUM,IN_SCAN,VISIBLE,'+
      'STATION_CODE,PARAM_CODE) values (%d,%s,%s,%s,%d)',
      [AParamNum, OraBoolean(AInScan), OraBoolean(AInScan), OraString(AStationCode), AParamCode]);
  end;
end;

end.
