import React from "react"
import * as Icon1 from "react-icons/bi"
import * as Icon2 from "react-icons/io5"
import * as Icon3 from "react-icons/hi2"


const contactDetails = [
  {
    icon: "HiChatBubbleLeftRight",
    heading: "Chat on us",
    description: "Our friendly team is here to help.",
    details: "info@xyz.com",
  },
  {
    icon: "BiWorld",
    heading: "Visit us",
    description: "Come and say hello at our office HQ.",
    details:
      "Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016",
  },
  {
    icon: "IoCall",
    heading: "Call us",
    description: "Mon - Fri From 8am to 5pm",
    details: "+123 456 7869",
  },
]

const ContactDetails = () => {
  return (
    <div className="flex flex-col gap-6 rounded-xl bg-gray-100 p-4 lg:p-6">
      {contactDetails.map((ele, i) => {
        // Determine the correct icon module
        let Icon;
        if (Icon1[ele.icon]) {
          Icon = Icon1[ele.icon ];
        } else if (Icon2[ele.icon ]) {
          Icon = Icon2[ele.icon];
        } else if (Icon3[ele.icon ]) {
          Icon = Icon3[ele.icon ];
        }

        return (
          <div
            className="flex flex-col gap-[2px] p-3 text-sm "
            key={i}
          >
            <div className="flex flex-row items-center gap-3">
              {Icon && <Icon size={25} />}
              <h1 className="text-lg font-semibold ">
                {ele.heading}
              </h1>
            </div>
            <p className="font-medium">{ele.description}</p>
            <p className="font-semibold">{ele.details}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ContactDetails
