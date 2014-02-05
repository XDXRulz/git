unit unitMain;
interface
uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, StdCtrls, KADaoDatabase, DB, KADaoTable, Oracle;

type
  TFormMain = class(TForm)
    btnImportConfig: TButton;
    btnImportData: TButton;
    btnExit: TButton;
    OracleSession1: TOracleSession;
    btnImportFolder: TButton;
    procedure btnImportConfigClick ( Sender:TObject );
    procedure btnImportDataClick ( Sender:TObject );
    procedure btnExitClick ( Sender:TObject );
    procedure btnImportFolderClick(Sender: TObject);
  protected
    function GetTerminated : Boolean;
  end;

var
  FormMain: TFormMain;

implementation
uses
  FileCtrl, ZhivkoDialogs, ZhivkoFiles, unitCommonOptions, classImportSetup, classImportData;

{$R *.dfm}

procedure TFormMain.btnImportConfigClick ( Sender:TObject );
var
  fn: String;
  worker: TImportSetup;
begin
  fn := SelectFileName('�������� ���� �� ������', '��������������� ����|network.mdb', 'mdb', True);
  if (fn > '') then begin
    worker := TImportSetup.Create();
    try
      worker.OnCheckTerminated := GetTerminated;
      worker.OnProcessMessages := Application.ProcessMessages;
      worker.Setup(CommonOptions.ReadString(iniSectionSetup, 'OracleDatabase', ''));
      if worker.Execute(fn)
        then ShowInfo('������ � �������� �������.')
        else ShowError('������ ��� ������ �� �����.');
    finally
      worker.Free;
    end;
  end;
end;

procedure TFormMain.btnImportDataClick ( Sender:TObject );
var
  fn: String;
  worker: TImportData;
begin
  fn := SelectFileName('�������� ���� �� ������', '���� � �����|*.mdb', 'mdb', True);
  if (fn > '') then begin
    worker := TImportData.Create();
    try
      worker.OnCheckTerminated := GetTerminated;
      worker.OnProcessMessages := Application.ProcessMessages;
      worker.Setup(CommonOptions.ReadString(iniSectionSetup, 'OracleDatabase', ''));
      if worker.Execute(fn)
        then ShowInfo('������ � �������� �������.')
        else ShowError('������ ��� ������ �� �����.');
    finally
      worker.Free;
    end;
  end;
end;

procedure TFormMain.btnImportFolderClick ( Sender:TObject );
var
  fn: String;
  worker: TImportData;
begin
  if SelectDirectory('�������� ������������ � �������', '', fn) then begin
    worker := TImportData.Create();
    try
      worker.OnCheckTerminated := GetTerminated;
      worker.OnProcessMessages := Application.ProcessMessages;
      worker.Setup(CommonOptions.ReadString(iniSectionSetup, 'OracleDatabase', ''));
      if worker.ExecuteFolder(fn)
        then ShowInfo('������� �� ��������� �������.')
        else ShowError('������ ��� ������ �� �������.');
    finally
      worker.Free;
    end;
  end;
end;

procedure TFormMain.btnExitClick ( Sender:TObject );
begin
  Close;
end;

function TFormMain.GetTerminated : Boolean;
begin
  Result := Application.Terminated;
end;

end.
