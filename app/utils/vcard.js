// VCard generation utility
export const generateVCard = (contactInfo) => {
  return `BEGIN:VCARD
VERSION:3.0
N:${contactInfo.name};;;;
FN:${contactInfo.name}
TEL;TYPE=WORK,VOICE:${contactInfo.phone}
EMAIL;TYPE=WORK:${contactInfo.email}
ADR;TYPE=WORK:;;${contactInfo.address}
URL:${contactInfo.website}
ORG:${contactInfo.organization}
END:VCARD`;
};

// Save contact to phone
export const saveContact = (contactInfo) => {
  const vCard = generateVCard(contactInfo);
  
  // Check if mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // For mobile: use data URI to directly open contact
    const dataUri = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(vCard);
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = 'KABI_Contact.vcf';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // For desktop: create blob and download
    const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'KABI_Contact.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

