object SfwImportService: TSfwImportService
  OldCreateOrder = False
  OnCreate = ServiceCreate
  DisplayName = 'SfwImportService'
  AfterInstall = ServiceAfterInstall
  OnContinue = ServiceContinue
  OnExecute = ServiceExecute
  OnPause = ServicePause
  OnStart = ServiceStart
  OnStop = ServiceStop
  Left = 269
  Top = 112
  Height = 150
  Width = 215
end
