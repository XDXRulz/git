object FormMain: TFormMain
  Left = 290
  Top = 112
  Width = 208
  Height = 193
  Caption = 'SfwImporter'
  Color = clBtnFace
  Font.Charset = RUSSIAN_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  Position = poScreenCenter
  PixelsPerInch = 96
  TextHeight = 13
  object btnImportConfig: TButton
    Left = 20
    Top = 20
    Width = 160
    Height = 25
    Caption = #1048#1084#1087#1086#1088#1090' '#1085#1072' '#1082#1086#1085#1092#1080#1075#1091#1088#1072#1094#1080#1103
    TabOrder = 0
    OnClick = btnImportConfigClick
  end
  object btnImportData: TButton
    Left = 20
    Top = 50
    Width = 160
    Height = 25
    Caption = #1048#1084#1087#1086#1088#1090' '#1085#1072' '#1076#1072#1085#1085#1080
    TabOrder = 1
    OnClick = btnImportDataClick
  end
  object btnExit: TButton
    Left = 105
    Top = 120
    Width = 75
    Height = 25
    Cancel = True
    Caption = #1048#1079#1093#1086#1076
    TabOrder = 3
    OnClick = btnExitClick
  end
  object btnImportFolder: TButton
    Left = 20
    Top = 80
    Width = 160
    Height = 25
    Caption = #1048#1084#1087#1086#1088#1090' '#1085#1072' '#1076#1080#1088#1077#1082#1090#1086#1088#1080#1103
    TabOrder = 2
    OnClick = btnImportFolderClick
  end
  object OracleSession1: TOracleSession
    DesignConnection = True
    LogonUsername = 'water'
    LogonPassword = 'water'
    LogonDatabase = 'AHU2'
    BytesPerCharacter = bcAutoDetect
    Left = 35
    Top = 125
  end
end
