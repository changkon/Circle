using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;


namespace circleappService.Utility
{
    public class PushNotification
    {
        /**
            data parameter must include tokens and notification.
            See ImportFriendsController for an example
        */
        public static void Send(dynamic data)
        {
            string json = Newtonsoft.Json.JsonConvert.SerializeObject(data);

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://push.ionic.io/api/v1/push");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Add("X-Ionic-Application-Id", "0366b4a3");
                var keyBase64 = "Basic " + Base64Encode("50747f5c2a0ba72af8fa7dd15705710dad02d8611e288dc5");
                client.DefaultRequestHeaders.Add("Authorization", keyBase64);
                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "push");
                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = client.SendAsync(request).Result;
            }
        }

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }
    }
}