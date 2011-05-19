<?
class IPBlocker extends CApplicationComponent
{
        public $sendEmail;
        public $errorText;
        private $userIP;
 
        public function init()
        {
                $this->userIP=$this->get_user_ip();
                if($this->verify_ip_ban())
                {
                        $this->sndEmail($this->sendEmail);
                        header("HTTP/1.0 403 Forbidden");
                        header("HTTP/1.1 403 Forbidden");
                        header("Status: 403 Forbidden");
                        die($this->errorText);
                        Yii::app()->end();
                }

                if($this->verify_useragent_ban())
                {
                        $this->sndEmail($this->sendEmail);
                        header("HTTP/1.0 403 Forbidden");
                        header("HTTP/1.1 403 Forbidden");
                        header("Status: 403 Forbidden");
                        die($this->errorText);
                        Yii::app()->end();
                }
        }

        protected function sndEmail($email)
        {
//                if(!empty($email))
//                {
//                        $message="";
//                        $message.="serverDateTime: ".date('d/m/Y H:i:s')."\n";
//                        $message.="userIP: ".$this->userIP."\n";
//                        $message.="userAgent: ".Yii::app()->request->userAgent."\n";
//                        $message.="url: ".Yii::app()->request->url."\n";
//                        $message.="urlReferrer: ".Yii::app()->request->urlReferrer."\n\n";
//
//                        $subject = 'Site error (IPBlocker): '.Yii::app()->request->hostInfo;
//                        $headers = 'From: '.$this->sendEmail . "\r\n" . 'Reply-To: '.$this->sendEmail . "\r\n" .'X-Mailer: PHP/' . phpversion();
//
//                        mail($this->sendEmail, $subject, $message, $headers);
//                }
        }
        
        protected function verify_useragent_ban()
        {
                $ips=file_get_contents(dirname(__FILE__).DIRECTORY_SEPARATOR.'IPBlockerUserAgent.txt');
                $addresses = preg_split('#\s+#', $ips, -1, PREG_SPLIT_NO_EMPTY);

            $userAgent = Yii::app()->request->userAgent;
                foreach ($addresses AS $banned_ip)
                {
                        if(stripos($userAgent, $banned_ip))
                        {
                                return TRUE;
                        }

                }
        return FALSE;
        }

    // get from VBulletin 3.8.1 (includes/functions.php)
        protected function verify_ip_ban()
        {
                $ips=file_get_contents(dirname(__FILE__).DIRECTORY_SEPARATOR.'IPBlocker.txt');
            $user_ipaddress = $this->userIP . '.';

        $addresses = preg_split('#\s+#', $ips, -1, PREG_SPLIT_NO_EMPTY);
        foreach ($addresses AS $banned_ip)
        {
            if (strpos($banned_ip, '*') === false AND $banned_ip{strlen($banned_ip) - 1} != '.')
            {
                $banned_ip .= '.';
            }

            $banned_ip_regex = str_replace('\*', '(.*)', preg_quote($banned_ip, '#'));
            if (preg_match('#^' . $banned_ip_regex . '#U', $user_ipaddress))
            {
                                return TRUE;
            }
        }
        return FALSE;
        }

        protected function get_user_ip()
        {
                $strRemoteIP = $_SERVER['REMOTE_ADDR'];
                if (!$strRemoteIP) { $strRemoteIP = urldecode(getenv('HTTP_CLIENTIP'));}
                if (getenv('HTTP_X_FORWARDED_FOR')) { $strIP = getenv('HTTP_X_FORWARDED_FOR'); }
                elseif (getenv('HTTP_X_FORWARDED')) { $strIP = getenv('HTTP_X_FORWARDED'); }
                elseif (getenv('HTTP_FORWARDED_FOR')) { $strIP = getenv('HTTP_FORWARDED_FOR'); }
                elseif (getenv('HTTP_FORWARDED')) { $strIP = getenv('HTTP_FORWARDED'); }
                else { $strIP = $_SERVER['REMOTE_ADDR']; }

                if ($strRemoteIP != $strIP) { $strIP = $strRemoteIP.", ".$strIP; }
                return $strIP;
        }

}