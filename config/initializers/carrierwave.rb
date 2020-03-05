# このファイルは、carrierwaveによる画像の保存先を、fog-awsGemを使い、aws上にあげる設定を書きます。
#fog-awsGemを使う旨はすでにImage_uploaderに書いています。のでawsに上げる記述をここに書きます。
require 'carrierwave/storage/abstract'
require 'carrierwave/storage/file'
require 'carrierwave/storage/fog'

CarrierWave.configure do |config|
  config.storage = :fog
  config.fog_provider = 'fog/aws'
  config.fog_credentials = {
    provider: 'AWS',
    aws_access_key_id: Rails.application.secrets.aws_access_key_id,
    aws_secret_access_key: Rails.application.secrets.aws_secret_access_key,
    region: 'ap-northeast-1'
  }
  # 上のaws_access_key_idの値と、aws_secret_access_keyの値は、secrets.ymlから呼んでいます。

  config.fog_directory  = 'chatspace20200731'
  #上は保存先のバケット名です。
  config.asset_host = 'https://s3-ap-northeast-1.amazonaws.com/chatspace20200731'
  #上は東京リージョンのバケット名に保存する旨です。
end