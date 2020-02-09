require 'sinatra'
require 'bundler/setup'
include FileUtils::Verbose

configure do
    set :server, :puma
    set :root, File.dirname(__FILE__)
    set :public_folder, Proc.new { File.join(root, "dist") }
end

get '/' do
    send_file File.join('dist', 'index.html')
end