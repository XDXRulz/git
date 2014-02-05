unit classImportData;
interface
uses
  Classes, classCustomImport, KADaoDatabase, KADaoTable;

type
  TImportData = class(TCustomDataImport)
  private
    FMdbDatabase: TKADaoDatabase;
  protected
    function Exists ( const AStationCode:String ): Boolean;
    function GetLastDate ( const AStationCode:String ): String;
    procedure UpdateData ( const AStationCode:String; AParamCode:Integer; const ADayDT:String;
      AValue:Double; ASampleRatio,ASampleCount:Integer; ASigma:Double;
      AStatus,AValid,AStatusProject:Integer; AMaxValue:Double; AMaxTime:Integer;
      AMinValue:Double; AMinTime:Integer );
  public
    constructor Create; override;
    destructor Destroy; override;
    function Execute ( const AFileName:String; ASkipInvalid:Boolean=False ): Boolean;
    function ExecuteFolder ( const AFolder:String ): Boolean;
  end;

implementation
uses
  SysUtils, ZhivkoFiles, ZhivkoAccess, ZhivkoOracle, unitCommonOptions, unitAirUtils;

{ TImportData }

constructor TImportData.Create;
begin
  inherited Create;
  FMdbDatabase := TKADaoDatabase.Create(nil);
end;

destructor TImportData.Destroy;
begin
  FMdbDatabase.Free;
  inherited;
end;

function TImportData.Execute ( const AFileName:String; ASkipInvalid:Boolean=False ): Boolean;
var
  source: TKADaoTable;
  stationCode,datum: String;
begin
  Result := False;
  CommonOptions.Log('Reading data file "%s"...', [AFileName]);
  if Connect then begin
    if FileExists(AFileName) then begin
      stationCode := ExtractFileName(AFileName);
      stationCode := Copy(stationCode, 8, Length(stationCode) - 11);
      if Exists(stationCode) then begin
        datum := GetLastDate(stationCode);
        if datum = '' then datum := '0000000000';
        FMdbDatabase.Close;
        FMdbDatabase.Database := AFileName;
        try
          FMdbDatabase.Open;
          source := TKADaoTable.Create(nil);
          try
            source.Database := FMdbDatabase;
            source.SQL.Text :=
              'SELECT Format(Data,"yyyymmdd") + Format(Ora,"00") AS DAYDT, '+
                'ParamID AS PARAM_CODE, Media AS VAL, Percentuale AS SAMPLE_RATIO, '+
                'Ncount AS SAMPLE_COUNT, Sigma, Status, Validazione AS VALID, '+
                'StatusProject AS STATUS_PROJECT, MaxVal AS MAX_VALUE, '+
                'MaxTime AS MAX_TIME, MinVal AS MIN_VALUE, MinTime AS MIN_TIME '+
              'FROM Misure '+
              'WHERE Ora>0 AND Format(Data,"yyyymmdd") + Format(Ora,"00")>='+ mdbString(datum) +' '+
              'ORDER BY Data, Ora, ParamID';
            source.Open;
            while (not source.EOF) and (not Terminated) do begin
              ProcessMessages;
              UpdateData(stationCode,
                source.FieldByName('PARAM_CODE').AsInteger,
                Copy(FixDate(source.FieldByName('DAYDT').AsString), 1, 10),
                source.FieldByName('VAL').AsFloat,
                source.FieldByName('SAMPLE_RATIO').AsInteger,
                source.FieldByName('SAMPLE_COUNT').AsInteger,
                source.FieldByName('SIGMA').AsFloat,
                source.FieldByName('STATUS').AsInteger,
                source.FieldByName('VALID').AsInteger,
                source.FieldByName('STATUS_PROJECT').AsInteger,
                source.FieldByName('MAX_VALUE').AsFloat,
                source.FieldByName('MAX_TIME').AsInteger,
                source.FieldByName('MIN_VALUE').AsFloat,
                source.FieldByName('MIN_TIME').AsInteger
              );
              source.Next;
            end;
          finally
            source.Free;
          end;
          Result := True;
        except
          on e:Exception do
            CommonOptions.LogError('Cannot connect to Access database: ' + e.Message);
        end;
      end else begin
        CommonOptions.LogError('File "%s" is invalid.', [AFileName]);
        Result := ASkipInvalid;
      end;
    end else
      CommonOptions.LogError('File "%s" does not exists.', [AFileName]);
  end else
    CommonOptions.LogError('Cannot connect to Oracle database.');
end;

function TImportData.ExecuteFolder ( const AFolder:String ): Boolean;
var
  sr: TSearchRec;
begin
  Result := False;
  CommonOptions.Log('Reading data folder "%s"...', [AFolder]);
  if FindFirst(AddToPath(AFolder, 'Station*.mdb'), faAnyFile, sr) = 0 then try
    repeat
      if not Execute(AddToPath(AFolder, sr.Name), True) then
        Exit;
    until FindNext(sr) <> 0;
    Result := True;
  finally
    FindClose(sr);
  end;
end;

function TImportData.Exists ( const AStationCode:String ): Boolean;
begin
  Result := Tools.DataExists(AStationCode, 'SFW_AS_STATIONS', 'STATION_CODE');
end;

function TImportData.GetLastDate ( const AStationCode:String ): String;
begin
  Result := Tools.GetString(
    'select min(MAXDT) as DT from (select PARAM_CODE,max(to_char(DATUM,''YYYYMMDDHH24'')) as MAXDT '+
      'from SFW_AS_DATA where STATION_CODE=%s group by PARAM_CODE) a', [OraString(AStationCode)]);
end;

procedure TImportData.UpdateData ( const AStationCode:String;
  AParamCode:Integer; const ADayDT:String; AValue:Double; ASampleRatio,ASampleCount:Integer;
  ASigma:Double; AStatus,AValid,AStatusProject:Integer; AMaxValue:Double; AMaxTime:Integer;
  AMinValue:Double; AMinTime:Integer );
begin
  if Tools.GetInteger('select count(*) from SFW_AS_DATA where STATION_CODE=%s '+
       'and PARAM_CODE=%d and to_char(DATUM,''YYYYMMDDHH24'')=%s',
       [OraString(AStationCode), AParamCode, OraString(ADayDT)]) > 0 then begin
    try
      Tools.Execute('update SFW_AS_DATA set VALUE=%s,SAMPLE_RATIO=%d,SAMPLE_COUNT=%d,SIGMA=%s,'+
        'STATUS=%d,VALID=%d,STATUS_PROJECT=%d,MAX_VALUE=%s,MAX_TIME=%d,MIN_VALUE=%s,MIN_TIME=%d '+
        'where STATION_CODE=%s and PARAM_CODE=%d and to_char(DATUM,''YYYYMMDDHH24'')=%s',
        [OraFloat(AValue, 6), ASampleRatio, ASampleCount, OraFloat(ASigma, 6),
         AStatus, AValid, AStatusProject, OraFloat(AMaxValue, 6), AMaxTime,
         OraFloat(AMinValue, 6), AMinTime, OraString(AStationCode), AParamCode,
         OraString(ADayDT)]);
    except
      on e:Exception do begin
        CommonOptions.LogError('Error on update: ' + e.Message);
        CommonOptions.Log('update SFW_AS_DATA set VALUE=%s,SAMPLE_RATIO=%d,SAMPLE_COUNT=%d,SIGMA=%s,'+
          'STATUS=%d,VALID=%d,STATUS_PROJECT=%d,MAX_VALUE=%s,MAX_TIME=%d,MIN_VALUE=%s,MIN_TIME=%d '+
          'where STATION_CODE=%s and PARAM_CODE=%d and to_char(DATUM,''YYYYMMDDHH24'')=%s',
          [OraFloat(AValue, 6), ASampleRatio, ASampleCount, OraFloat(ASigma, 6),
           AStatus, AValid, AStatusProject, OraFloat(AMaxValue, 6), AMaxTime,
           OraFloat(AMinValue, 6), AMinTime, OraString(AStationCode), AParamCode,
           OraString(ADayDT)], True);
      end;
    end;
  end else begin
    try
    Tools.Execute('insert into SFW_AS_DATA (VALUE,SAMPLE_RATIO,SAMPLE_COUNT,SIGMA,STATUS,VALID,'+
      'STATUS_PROJECT,MAX_VALUE,MAX_TIME,MIN_VALUE,MIN_TIME,STATION_CODE,PARAM_CODE,DATUM) '+
      'values (%s,%d,%d,%s,%d,%d,%d,%s,%d,%s,%d,%s,%d,to_date(%s,''YYYYMMDDHH24''))',
      [OraFloat(AValue, 6), ASampleRatio, ASampleCount, OraFloat(ASigma, 6),
       AStatus, AValid, AStatusProject, OraFloat(AMaxValue, 6), AMaxTime,
       OraFloat(AMinValue, 6), AMinTime, OraString(AStationCode), AParamCode,
       OraString(ADayDT)]);
    except
      on e:Exception do begin
        CommonOptions.LogError('Error on insert: ' + e.Message);
        CommonOptions.Log('insert into SFW_AS_DATA (VALUE,SAMPLE_RATIO,SAMPLE_COUNT,SIGMA,STATUS,VALID,'+
          'STATUS_PROJECT,MAX_VALUE,MAX_TIME,MIN_VALUE,MIN_TIME,STATION_CODE,PARAM_CODE,DATUM) '+
          'values (%s,%d,%d,%s,%d,%d,%d,%s,%d,%s,%d,%s,%d,to_date(%s,''YYYYMMDDHH24''))',
          [OraFloat(AValue, 6), ASampleRatio, ASampleCount, OraFloat(ASigma, 6),
           AStatus, AValid, AStatusProject, OraFloat(AMaxValue, 6), AMaxTime,
           OraFloat(AMinValue, 6), AMinTime, OraString(AStationCode), AParamCode,
           OraString(ADayDT)], True);
      end;
    end;
  end;
end;

end.
