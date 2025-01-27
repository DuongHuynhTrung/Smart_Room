const nodemailer = require("nodemailer");

const formatPriceToVND = (price) => {
  return `${price.toLocaleString("vi-VN")} VNĐ`;
};

const sendMailOrderCompleted = async (
  user_name,
  email,
  order_code,
  sub_total_price,
  delivery_price,
  total_voucher,
  total_price
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Format prices to VND
  const formattedSubTotalPrice = formatPriceToVND(sub_total_price);
  const formattedDeliveryPrice = formatPriceToVND(delivery_price);
  const formattedTotalVoucher = total_voucher
    ? formatPriceToVND(total_voucher)
    : "N/A";
  const formattedTotalPrice = formatPriceToVND(total_price);

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Order Completed",
    html: `<body style="background-color:#fff;font-family:-apple-system,BlinkMacSystemFont,Segoe
                UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif">
                <div style="width:50vw; margin: 0 auto">
                    <div style="width: 100%; height: 150px; margin: 0 auto;">
                        <img src="https://live.staticflickr.com/65535/54064315460_2979f12bd2_w.jpg"
                            style="width: auto;height:150px;object-fit: cover; margin-left: 30%;">
                    </div>
                    <table style="padding:0 40px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation"
                        width="100%">
                        <tbody>
                            <tr>
                                <td>
                                    <hr
                                        style="width:100%;border:none;border-top:1px solid black;border-color:black;margin:20px 0" />
                                    <p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043;margin-bottom: 25px;">
                                        Xin chào
                                        <a style="font-size:16px;line-height:22px;margin:16px 0;font-weight: bold;">${
                                          user_name || ""
                                        },</a>
                                    </p>
                                    <p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043;text-align: justify">
                                        Chúng tôi gửi email này để thông báo rằng hệ thống
                                        <span style="font-weight:bold;text-decoration:none;font-size:14px;line-height:22px">
                                            Everfresh
                                        </span> ghi nhận bạn đã thanh toán thành công giao dịch với mã số<span
                                            style="font-weight:bold;text-decoration:none;font-size:14px;line-height:22px">
                                            ${order_code}
                                    </p>

                                    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0"
                                        width="100%"
                                        style="max-width:37.5em;background-color:#ffffff;border:1px solid #eee;border-radius:5px;box-shadow:0 5px 10px rgba(20,50,70,.2);margin-top:20px;width:360px;margin:0 auto;padding:68px 0 68px">
                                        <div>
                                            <tr style="width:100%">
                                                <td>
                                                    <img alt="livestatic"
                                                        src="https://live.staticflickr.com/65535/54064138173_19cd5f970c_q.jpg"
                                                        width="100" height="auto"
                                                        style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" />
                                                    <p
                                                        style="padding-bottom:25px;font-size:22px;line-height:16px;margin:35px 8px 8px 8px;color:#9FC78A;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;height:16px;letter-spacing:0;text-align:center">
                                                        Order completed!</p>

                                                    <table align="center" role="presentation" cellSpacing="0" cellPadding="0"
                                                        border="0" width="100%"
                                                        style="max-width:37.5em;background-color:#ffffff;border:1px solid #eee;margin-top:20px;width:360px;margin:0 auto;">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <p
                                                                        style="padding-left:30%;max-width:37.5em;font-size:13px;line-height:40px;margin:0 auto;color:#000;display:inline-block;text-align: center;">
                                                                        Order: </p>
                                                                    <p
                                                                        style="font-size:13px;line-height:40px;margin:0 auto;color:#000;display:inline-block;">
                                                                        ${formattedSubTotalPrice}</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <p
                                                                        style="padding-left:30%;font-size:13px;line-height:40px;margin:0 auto;color:#000;display:inline-block;">
                                                                        Delivery:</p>
                                                                    <p
                                                                        style="font-size:13px;line-height:40px;margin:0 auto;color:#000;display:inline-block;">
                                                                        ${formattedDeliveryPrice}</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <p
                                                                        style="padding-left:30%;font-size:13px;line-height:40px;margin:0 auto;color:#000;display:inline-block;">
                                                                        Voucher:</p>
                                                                    <p
                                                                        style="font-size:13px;line-height:40px;margin:0 auto;color:#000;display:inline-block;">
                                                                        ${formattedTotalVoucher}</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <p
                                                                        style="padding-left:30%;font-size:13px;line-height:40px;margin:0 auto;color:#000;display:inline-block;font-weight: bold;">
                                                                        Summary:</p>
                                                                    <p
                                                                        style="font-size:13px;line-height:40px;margin:0 auto;color:#000;display:inline-block;font-weight: bold;">
                                                                        ${formattedTotalPrice}</p>
                                                                </td>
                                                            </tr>

                                                        </tbody>
                                                    </table>

                                            </tr>
                                        </div>
                                    </table>

                                    <p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043;text-align: justify">
                                        Chúng tôi hy vọng rằng quý khách đã có trải nghiệm mua sắm tuyệt vời và hài lòng với sản
                                        phẩm mà mình đã chọn. Nếu có bất kỳ câu hỏi, thắc mắc hoặc phản hồi nào, xin quý khách đừng
                                        ngần ngại liên hệ với chúng tôi.
                                    </p>
                                    <p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043;text-align: justify">
                                        Sự hài lòng của quý khách chính là ưu tiên hàng đầu của chúng tôi. Chúng tôi rất mong sẽ
                                        tiếp tục được phục vụ quý khách trong tương lai.
                                    </p>
                                    <p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043">Trân trọng,</p>
                                    <p
                                        style="font-weight:bold;font-size:16px;line-height:22px;margin:16px 0px 0px 0px;color:#3c4043">
                                        Everfresh</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </body>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

module.exports = { sendMailOrderCompleted };
